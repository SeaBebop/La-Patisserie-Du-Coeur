
# Register your models here.
from django.contrib import admin
from .models import Category , Product,Cart, OrderItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name','slug']
    prepopulated_fields = {'slug':('name',)}

    
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name','category','description', 'slug', 'price',
        'quantity', 'created', 'updated','link',]
    list_display_links = ('link',)
    list_filter = ['quantity', 'created', 'updated','category']
    list_editable = ['name','quantity', 'description','price']
    prepopulated_fields = {'slug':('name',)}
   
   #This is a callable display that acts as a link to the editable page 
   #Use this without having to make a field just to have
    @admin.display(description="") # Here
    def link(self, obj):
        return "" 
    

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user' ,'updated' ,'orders','timestamp' ,'session_key'] 

@admin.register(OrderItem)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id','user','quantity' ,'item' ,'ordered'] 