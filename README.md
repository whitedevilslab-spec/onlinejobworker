# Online Job Worker - Service Marketplace Platform

A comprehensive service marketplace platform built with Node.js, Express.js, MongoDB, and modern web technologies. This platform connects service providers (workers) with customers seeking various services.

## 🎯 Project Overview

This project is developed as an IGNOU (Indira Gandhi National Open University) Web Application Development Project. It integrates:
- Frontend design with HTML5, CSS3, and JavaScript
- Backend programming with Node.js and Express.js
- Database management with MongoDB
- Administrative controls and monitoring

The platform resembles real-world applications like UrbanClap, JustDial, and Housejoy.

## 📋 Features

### User Features
- User registration and authentication
- User profile management
- Search and filter services
- Book services from workers
- Payment processing
- Review and rating system
- Booking history
- Notifications

### Worker Features
- Worker registration and verification
- Profile management
- Service listing
- Booking management
- Earnings tracking
- Customer reviews
- Rating and feedback

### Admin Features
- User management
- Worker approval and verification
- Booking monitoring
- Payment tracking
- Analytics and reports
- System configuration
- Content management

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- HTML5
- CSS3
- JavaScript (Vanilla)
- Responsive Design

**Backend:**
- Node.js
- Express.js
- RESTful API

**Database:**
- MongoDB
- Mongoose ODM

**Authentication:**
- JWT (JSON Web Tokens)
- bcryptjs for password hashing

**Payment Processing:**
- Stripe API

**Email Service:**
- Nodemailer

## 📁 Project Structure

```
onlinejobworker/
├── public/               # Static files (CSS, images, uploads)
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
├── views/                # HTML templates
├── routes/               # API routes
├── controllers/          # Business logic
├── models/               # Database schemas
├── middleware/           # Custom middleware
├── config/               # Configuration files
├── utils/                # Utility functions
├── server.js             # Main server file
├── package.json          # Dependencies
├── .env                  # Environment variables
└── README.md             # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/whitedevilslab-spec/onlinejobworker.git
cd onlinejobworker
```

2. Install dependencies
```bash
npm install
```

3. Create .env file
```bash
cp .env.example .env
```

4. Update .env with your configuration
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_API_KEY=your_stripe_key
```

5. Run the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/bookings` - Get user bookings

### Workers
- `GET /api/workers` - List all workers
- `GET /api/workers/:id` - Get worker details
- `POST /api/workers/register` - Register as worker
- `PUT /api/workers/:id` - Update worker profile
- `GET /api/workers/search` - Search workers by service

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking status
- `GET /api/bookings` - List bookings
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Payment history

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/reviews/worker/:id` - Get worker reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/workers` - Manage workers
- `POST /api/admin/workers/:id/approve` - Approve worker
- `GET /api/admin/bookings` - Monitor bookings
- `GET /api/admin/reports` - Generate reports

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation and sanitization
- Role-based access control
- Secure payment processing
- Environment variable management

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  address: String,
  city: String,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Workers Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  serviceType: String,
  experience: Number,
  hourlyRate: Number,
  about: String,
  skills: [String],
  verified: Boolean,
  rating: Number,
  totalReviews: Number,
  profileImage: String,
  documents: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  workerId: ObjectId,
  serviceType: String,
  bookingDate: Date,
  duration: Number,
  status: String, // pending, confirmed, completed, cancelled
  totalAmount: Number,
  paymentStatus: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payments Collection
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId,
  userId: ObjectId,
  amount: Number,
  currency: String,
  paymentMethod: String,
  status: String, // pending, completed, failed
  transactionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

This uses nodemon for auto-restart on file changes.

### Code Style
- Follow ESLint rules
- Use consistent naming conventions
- Comment complex logic
- Write meaningful commit messages

## 📝 API Documentation

Detailed API documentation is available in the `/docs` folder.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**whitedevilslab-spec**
- GitHub: [@whitedevilslab-spec](https://github.com/whitedevilslab-spec)

## 📞 Support

For support, email support@onlinejobworker.com or open an issue on GitHub.

## 🙏 Acknowledgments

- IGNOU for project guidelines
- MongoDB for database
- Express.js community
- All contributors and testers

---

**Last Updated:** June 2026
**Version:** 1.0.0
