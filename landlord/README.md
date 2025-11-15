# Ubani Landlord Dashboard

A comprehensive React-based landlord dashboard for managing the Ubani property management platform.

## Features

- **Dashboard Overview**: Key metrics, charts, and system overview
- **User Management**: Manage tenants, landlords, and landlord users
- **Property Management**: Oversee property listings and approvals
- **Application Management**: Review and process rental applications
- **Payment Management**: Track payments and generate reports
- **Maintenance Management**: Handle maintenance requests and repairs
- **System Settings**: Configure system-wide settings
- **Role-Based Access Control**: Permission-based feature access
- **Real-time Analytics**: Interactive charts and data visualization
- **Export Functionality**: CSV export for various data types

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: React Icons (Feather Icons)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Data Fetching**: React Query
- **Charts**: Recharts
- **Notifications**: React Toastify
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ubani/landlord
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update the environment variables in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css          # Global styles
```

## Key Components

### Authentication

- Login page with secure authentication
- JWT token management
- Protected routes with permission checks

### Dashboard

- Real-time statistics cards
- Interactive charts (Line, Bar, Pie)
- Quick action buttons
- Recent activity feed

### User Management

- User listing with filters and search
- User verification and status management
- Bulk operations
- CSV export functionality

### Permission System

- Role-based access control
- Granular permissions
- Route-level protection
- Feature-level restrictions

## API Integration

The landlord dashboard connects to the backend API for:

- User authentication and authorization
- Data fetching and manipulation
- File uploads
- Real-time updates

API endpoints are configured in `src/services/api.ts` with:

- Automatic token attachment
- Error handling and notifications
- Response interceptors
- Request/response logging

## Styling

The application uses Tailwind CSS with custom landlord theme:

- Consistent color palette
- Responsive design patterns
- Custom component classes
- Dark/light mode support (planned)

## Security Features

- JWT token-based authentication
- Protected routes
- Permission-based access control
- Secure API communication
- Input validation and sanitization

## Performance

- Code splitting with React.lazy
- Image optimization
- Bundle optimization with Vite
- React Query for efficient data fetching
- Memoization for expensive operations

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Development Guidelines

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Consistent naming conventions
- Component-based architecture

### State Management

- React Context for global state
- React Query for server state
- Local state for component state

### Error Handling

- Global error boundaries
- API error handling
- User-friendly error messages
- Logging for debugging

## Deployment

### Environment Variables

Set the following environment variables for production:

- `VITE_API_BASE_URL`: Backend API URL
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Version number

### Build Process

1. Install dependencies
2. Run build command
3. Deploy `dist` folder to web server
4. Configure reverse proxy if needed

## Contributing

1. Follow the existing code style
2. Write TypeScript types for new features
3. Add proper error handling
4. Update documentation
5. Test thoroughly before submitting

## License

This project is proprietary software for Ubani platform.

## Support

For technical support or questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation
