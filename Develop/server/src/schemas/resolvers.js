import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

interface BookInput {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image?: string;
  link?: string;
}

interface Context {
  user?: {
    _id: unknown;
    username: string;
    email: string;
  };
}

const resolvers = {
  Query: {
    // Get the logged in user
    me: async (_parent: any, _args: any, context: Context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    // Login user
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong password!');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Create user
    addUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Save book to user's savedBooks array
    saveBook: async (_parent: any, { bookData }: { bookData: BookInput }, context: Context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    // Remove book from user's savedBooks array
    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: Context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;