# Home Care System

A comprehensive platform designed to connect home care service providers with customers needing assistance. The system facilitates service requests, offers, and management through a modern web application with a microservices backend architecture.

## Project Overview

The Home Care System consists of multiple components working together to provide a complete solution:

- **User Management Service**: Handles authentication, user profiles, and permissions
- **Service Management & Request Service**: Manages service categories, customer requests, and provider offers
- **Notification Service**: Handles system notifications and alerts
- **Frontend Application**: React-based user interface for all user interactions

## Backend Architecture

The backend is built using a microservices architecture with the following components:

### User Management Service

- **Authentication**: JWT-based authentication system
- **User Management**: User profiles, roles, and permissions
- **Technologies**: Django, Django REST Framework

### Service Management & Request Service

- **Service Categories**: Management of available service types
- **Service Requests**: Customer request handling and tracking
- **Service Offers**: Provider offer management and matching
- **Technologies**: Django, Django REST Framework, Celery

### Notification Service

- **Real-time Notifications**: User alerts and system messages
- **Email Notifications**: Outbound communication
- **Technologies**: Django, Django REST Framework

## Frontend Application

The frontend is a modern React application with the following features:

- **Responsive Design**: Works on desktop and mobile devices
- **User Dashboard**: Personalized views for customers and providers
- **Service Request Management**: Interface for creating and tracking service requests
- **Service Offer Management**: Tools for providers to respond to requests
- **Real-time Notifications**: Instant updates on system events

### Technologies Used

- React 19.1.0
- React Router 7.4.0
- Axios for API communication
- Chart.js and React-Chartjs-2 for data visualization
- React-Toastify for notifications
- JWT authentication

## Getting Started

### Backend Setup

1. Clone the repository
2. Set up a virtual environment for each service
3. Install dependencies for each service:

```bash
cd Backend/Service\ Management\ \&\ Request/service_mgmt_and_request
pip install -r requirements.txt

# Repeat for other services
```

4. Configure database settings in each service's settings.py file
5. Run migrations and start each service:

```bash
python manage.py migrate
python manage.py runserver 8000  # Use different ports for each service
```

### Frontend Setup

1. Navigate to the Frontend directory
2. Install dependencies:

```bash
cd Frontend
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### User Management

- `POST /api/auth/login/`: User authentication
- `POST /api/auth/register/`: User registration
- `GET /api/users/profile/`: Get user profile

### Service Management

- `GET /api/services/categories/`: List service categories
- `POST /api/services/requests/`: Create service request
- `GET /api/services/requests/`: List service requests
- `POST /api/services/offers/`: Create service offer
- `GET /api/services/offers/`: List service offers

### Notifications

- `GET /api/notifications/`: List user notifications
- `PUT /api/notifications/{id}/read/`: Mark notification as read

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
