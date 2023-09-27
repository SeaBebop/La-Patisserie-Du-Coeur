# La Patisserie Du Coeur

La Patisserie Du Coeur is an e-commerce bakery website that allows users to order goods online. The website is built using Django REST API on the backend and ReactJS, Docker and TailwindCSS on the frontend.

## Features

   * Users can browse and select bakery goods to add to their cart.
   * Celery task and beat managing the product inventory
   * Anonymous users are registered as a persistent session user that have a cart and purchase history
   * Users that register will have an account that utilizes JWT cookie authentication and can persist log in
   * Anonymous users can transfer their old session carts to their new account carts
   * Purchases are processed by a test mode version of Stripe webhook
  
## Setup

    Clone the repository:

    git clone https://github.com/<your-username>/La-Patisserie-Du-Coeur.git
    cd La-Patisserie-Du-Coeur
### Set up each docker container with the following environment:

  * DJANGO_DEBUG
  * DOCKER_KEY
  * DJANGO_SETTINGS_MODULE
  * DOCKER_STRIPE
  * DOCKER_ENDPOINT_SK
  * DOCKER_DEFAULT_FROM_EMAIL (Optional)
  * DOCKER_EMAIL_HOST_PASSWORD (Optional)
    

### Build and run the Docker container:

    docker-compose up --build
    new terminal
    cd frontend
    npm i
    npm start
    Navigate to http://localhost:3000 to view the website.

### Dependencies

    Docker 20.10.5
    Python 3.8
    Django 3.2
    Django REST Framework 3.12
    ReactJS 17.0
    TailwindCSS 2.1
    Stripe 2.57

# Goals

:heavy_check_mark: Have a session user for the anonymous and JWT user for the registered user<br>
  :heavy_check_mark: On succesful checkout, cart is archived to purchase history<br>
    :arrow_right::heavy_check_mark: For both Session User and JWT User.<br>
  :heavy_check_mark: On succesful checkout, order data is removed and quantity of product object decreases <br>
  :arrow_right::heavy_check_mark: Deal with case where product quantity is 0<br>
   :heavy_check_mark: Create stripe customer ID for both the session and JWT user on product selection<br>
   :arrow_right::heavy_check_mark:Transfer Customer ID from session user to JWT user on registration <br>
    :heavy_check_mark: Purchase History Backend<br>
    :heavy_check_mark: Purchase History Frontend<br>
    :arrow_right: Make it look better<br>
    :heavy_check_mark:More Marketable design of the page<br>
    :heavy_check_mark:Webhook dealing with failed purchases<br>
    :arrow_right::heavy_check_mark: Create email of failed purchase<br>
    :heavy_check_mark:Fix Bug purchase history api call bricks other api calls for session user<br>
    :heavy_check_mark:Mobile Friendliness<br>
    :arrow_right:Make some units slightly bigger<br>
    :heavy_check_mark:Use celery task and beat<br>
    :arrow_right::heavy_check_mark:Fixed the issue of restrictive time to trigger worker is ignored<br>
    :heavy_check_mark:Fix login and sign up page visuals<br>
    :arrow_right:Create a test.py and then deploy it before hacktober<br>
    :arrow_right:Complete commit guide and make issue submissions clear+accurate<br> 
    
