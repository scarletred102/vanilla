# Vinyl Record Store

A full-stack e-commerce application for selling vinyl records, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication and authorization
- Product catalog with filtering and search
- Shopping cart functionality
- Secure payment processing with Stripe
- Order management
- Admin dashboard
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Stripe account (for payment processing)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Client
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vinyl-record-store.git
cd vinyl-record-store
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

## Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`.

## Testing

1. Run server tests:
```bash
cd server
npm test
```

2. Run client tests:
```bash
cd client
npm test
```

## Deployment

1. Build the client:
```bash
cd client
npm run build
```

2. Deploy the server:
```bash
cd server
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Stripe](https://stripe.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Styled Components](https://styled-components.com/) 