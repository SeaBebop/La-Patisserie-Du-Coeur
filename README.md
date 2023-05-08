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

    Navigate to http://localhost:3000 to view the website.

Dependencies

    Docker 20.10.5
    Python 3.8
    Django 3.2
    Django REST Framework 3.12
    ReactJS 17.0
    TailwindCSS 2.1
    Stripe 2.57

Credits
