## La Patisserie Du Coeur

La Patisserie Du Coeur is an e-commerce bakery website that allows users to order goods online. The website is built using Django REST API on the backend and ReactJS, Docker, and TailwindCSS on the frontend.

Features

   * Users can browse and select bakery goods to add to their cart.
   * Anonymous users are identified with a session ID that expires in 2 weeks, which is used to store orders in their respective carts.
   * Users that register will have an account that utilizes JWT cookie authentication and can persist log in.
   * Users can transfer their old session carts to their new account carts.
   * Purchases are processed by a test mode version of Stripe.
  
Setup

    Clone the repository:

    git clone https://github.com/<your-username>/La-Patisserie-Du-Coeur.git
    cd La-Patisserie-Du-Coeur

Build and run the Docker container:

    docker-compose up --build
    cd frontend
    npm start
    Navigate to http://localhost:3000 to view the website.

Dependencies

    Docker 20.10.5
    Python 3.8
    Django 3.2
    Django REST Framework 3.12
    ReactJS 17.0
    TailwindCSS 2.1
    Stripe 2.57

Goals

    Once checkout = true, ordered needs to be true<- Changing this to deletion
    Ordered needs to be used as a condition that prevents further purchases<- Changing this to deletion
    Customer object for session and account on product selection <-Done
    ->Finished the auth->fixed
    ->need to finish the annon part->fixed
    Purchase History Backend<-Done and improved improved but I think it needs a tiny bit more
    Purchase History Frontend<-This weeks goal
    Transferable data between session and account(cart and customer object transfer)<-Done
    More Marketable design of the page<-This weeks goal
    Webhook causing data deletion<-Done on this
    Webhook dealing with failures + more emails<-Done but more emails can be added if increased functionality
    Should data transfer be option?<-Currently not an option, happens on sign up page
    Bug:Purchase history bricks other api calls for session user<-Current goal

Credits
