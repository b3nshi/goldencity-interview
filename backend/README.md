# GoldenCity Backend

NestJS backend application implementing Onion Architecture with Notes management API.

## 1. Requirements

Before running the application, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **TypeScript**: Will be installed as a dev dependency

To check your versions:

```bash
node --version
npm --version
```

## 2. How to Run the Application

### Installation

First, install all dependencies:

```bash
npm install
```

### Development Mode

Run the application in development mode with hot-reload:

```bash
npm run start:dev
```

The server will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

### Production Mode

Build the application:

```bash
npm run build
```

Then start the production server:

```bash
npm run start:prod
```

### Other Available Scripts

- `npm start` - Start the application (compiled)
- `npm run start:debug` - Start in debug mode with watch
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code using Prettier
- `npm test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage report

## 3. Postman Collection

A Postman collection is provided to test all API endpoints easily.

### Importing the Collection

1. Open Postman application
2. Click on **Import** button (top left)
3. Select the file: `GoldenCity.postman_collection.json` from the backend folder
4. The collection "GoldenCity" will be imported with all endpoints

### Available Endpoints in the Collection

The collection includes the following requests:

1. **Create new note** (POST)
   - URL: `http://localhost:3000/api/notes`
   - Body: JSON with `title` and `content` fields
   - Example:
     ```json
     {
       "title": "Title of the Note",
       "content": "Content of Note"
     }
     ```

2. **Notes** (GET)
   - URL: `http://localhost:3000/api/notes`
   - Retrieves all notes

3. **Get Note By ID** (GET)
   - URL: `http://localhost:3000/api/notes/:id`
   - Replace `:id` with an actual note ID

4. **Update Note By ID** (PUT)
   - URL: `http://localhost:3000/api/notes/:id`
   - Body: JSON with optional `title` and/or `content` fields
   - Example:
     ```json
     {
       "title": "New Title"
     }
     ```

5. **Delete Note By ID** (DELETE)
   - URL: `http://localhost:3000/api/notes/:id`
   - Deletes the note with the specified ID

### Using the Collection

1. Make sure the backend server is running (`npm run start:dev`)
2. Open the "GoldenCity" collection in Postman
3. Click on any request to test it
4. For requests that require an ID (GET, PUT, DELETE), first create a note to get an ID, then use that ID in the URL

### Note

The Postman collection uses `localhost:3000` by default. If your server runs on a different port, update the URLs in the collection accordingly.

## 4. Swagger Docs

The API documentation is automatically generated using Swagger and is available when the server is running.

### Accessing Swagger Documentation

1. Start the application:

   ```bash
   npm run start:dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api-docs
   ```

### Using Swagger UI

The Swagger UI provides an interactive interface to:

- **View all available endpoints** - See all API routes organized by tags
- **Test endpoints directly** - Click "Try it out" on any endpoint to test it
- **View request/response schemas** - See the structure of request bodies and responses
- **See example values** - View example data for each field

### API Information

- **Title**: Goldencity
- **Description**: API Documentation
- **Version**: 1.0
- **Base URL**: `http://localhost:3000`

### Available Endpoints in Swagger

All endpoints are documented under the **notes** tag:

- `POST /api/notes` - Create a new note
- `GET /api/notes` - Get all notes
- `GET /api/notes/{id}` - Get a note by ID
- `PUT /api/notes/{id}` - Update a note by ID
- `DELETE /api/notes/{id}` - Delete a note by ID

### Testing with Swagger

1. Click on an endpoint to expand it
2. Click **"Try it out"** button
3. Fill in the required parameters (if any)
4. For POST and PUT requests, modify the request body in the JSON editor
5. Click **"Execute"** to send the request
6. View the response below, including status code and response body

### Example: Creating a Note via Swagger

1. Navigate to `POST /api/notes`
2. Click **"Try it out"**
3. Modify the request body:
   ```json
   {
     "title": "My First Note",
     "content": "This is the content of my note"
   }
   ```
4. Click **"Execute"**
5. View the response with the created note (including generated ID, createdAt, and updatedAt)
