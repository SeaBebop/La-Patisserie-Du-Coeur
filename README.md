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
    Purchase History Frontend<-Basic idea done
    Transferable data between session and account(cart and customer object transfer)
    More Marketable design of the page<-Deciding ideas
    Webhook causing data deletion<-Done on this
    Webhook dealing with failures + more emails<-Currently on this
    Should data transfer be option? Probably not. Need to keep track of the order data 
    if the session user and request.user is the same persion for refund and purchase 
    history purposes.<-Not there yet

Credits
