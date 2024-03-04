from celery import Celery,shared_task
from django.conf import settings
from celery.schedules import crontab
from kombu import Connection
from environs import Env
import os
import django
django.setup()

env = Env()
env.read_env()
userName = env('RABBITMQ_DEFAULT_USER')
pwd = env('RABBITMQ_DEFAULT_PASS')
#Did this to learn about celery 
#I would imagine that with a constantly updating csv/model of
#The shop owners inventory this would be how the website constantly updates
broker_url = 'pyamqp://' + userName + ':' + pwd + '@rabbitmq:5672//'



with Connection(broker_url) as conn:
    print("Broker connection established.")
app = Celery('restock',broker= broker_url)


app.conf.result_backend = 'rpc://'

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Define the schedule using crontab. It runs every minute.
    sender.add_periodic_task(crontab(minute="0",hour="0"), update.s())

def trigger():
    try:
        #Trying to ensure that Django app works
        #Had a massive 
        import random              
        from django.contrib.auth.models import Permission
        from django.contrib.contenttypes.models import ContentType
        from django.apps import apps
        from post.models import Product
        random_number = random.randint(10, 30)
        Product.objects.all().update(quantity=random_number)
    except Exception as e:
        print(e)
        

@shared_task
def update():
    #Bit redundant 
    #however I did this to ensure app not loaded error is caught   
    try:
        trigger()     
    except Exception as e:
        print(e)
    return "Sent!"



if __name__ == '__main__':
    app.start()
