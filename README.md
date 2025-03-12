To deploy your Book Search Engine app on Render, you'll need to follow these steps:

## 1. Prepare Your Repository

First, make sure your code is in a Git repository (GitHub, GitLab, etc.) as Render deploys directly from your repository.

## 2. Set Up MongoDB Atlas

Before deploying to Render, you need a MongoDB database in the cloud:

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is enough for development)
3. Set up database access:
   - Create a database user with password authentication
   - Add your IP address to the IP access list (or use 0.0.0.0/0 for all IPs, though less secure)
4. Connect to your cluster:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it will look like: `mongodb+srv://username:<password>@cluster0.xxx.mongodb.net/database?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual password

## 3. Sign Up for Render

If you haven't already, create an account at [render.com](https://render.com/).

## 4. Deploy Your Backend

1. From your Render dashboard, click "New" and select "Web Service"
2. Connect your Git repository
3. Configure your service:
   - **Name**: Choose a name for your service (e.g., "book-search-engine-api")
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: Develop
4. Add environment variables:
   - Click "Advanced" and add the following environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET_KEY`: Your secret key for JWT authentication
5. Click "Create Web Service"

## 5. Troubleshooting

If you encounter issues during deployment:

1. Check Render logs for error messages
2. Verify that all environment variables are set correctly
3. Check that your build and start commands are correct
4. Make sure your package.json has the right dependencies and scripts

## Questions and Concerns

contact: Martin.rojo101@gmail.com 

Github: https://github.com/Martin-rojo

Deployed link: https://book-search-engine-v53k.onrender.com/

<img width="720" alt="image" src="https://github.com/user-attachments/assets/4fd84cfb-edd9-480d-9c84-51adc5ae3011" />
