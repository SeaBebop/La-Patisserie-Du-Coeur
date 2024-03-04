
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
    # Check permissions for read-only request
            return True
        else:
            #This is condition is to allows either the
            #Edit any Category they want
            if request.user.is_superuser or hasattr(request.user,'is_Admin'):
                if request.user.is_superuser:
                    return True
                else:
                    #This condition allows the admin/store owner add/edit any Category they want
                    if request.user.is_Admin():
                        return True
            return False
    # Check permissions for write request   

#Our four conditions for the private routes in react JS
class IsPremiumOnly(permissions.BasePermission):
    def has_permission(self, request,view):
        if request.user.is_authenticated and request.user.is_Premium():       
            return True 
        return False

class IsStandardOnly(permissions.BasePermission):
    def has_permission(self, request,view):
        if request.user.is_authenticated and request.user.is_Standard():       
            return True 
        return False

class IsWhaleOnly(permissions.BasePermission):
    def has_permission(self, request,view):
        if request.user.is_authenticated and request.user.is_Whale():       
            return True 
        return False

class IsAdminOnly(permissions.BasePermission):
    def has_permission(self, request,view):
        if request.user.is_authenticated and request.user.is_Admin():       
            return True 
        return False

