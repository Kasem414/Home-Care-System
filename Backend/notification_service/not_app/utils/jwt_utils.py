import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

def get_user_from_token(request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise AuthenticationFailed("Authorization header missing or invalid")

    token = auth_header.split(" ")[1]

    try:
        decoded = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id = decoded.get("user_id")
        user_role = decoded.get("role")  # optional if included in JWT

        if user_id is None:
            raise AuthenticationFailed("Invalid token: user_id not found")

        return user_id, user_role

    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Token expired")
    except jwt.InvalidTokenError:
        raise AuthenticationFailed("Invalid token")