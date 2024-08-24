# The Memory Table Project

## Description

**The Memory Table** is a technological installation designed to help individuals with Alzheimer's retain their memories through an interactive table that leverages NFC technology. The project aims to support patients by providing them with easy access to memories, enhancing their connection to their identity, and improving their overall well-being through reminiscence therapy.

This project is my final work for my **Bachelor in Multimedia and Creative Technologies** at Erasmus Hogeschool Brussels. It showcases my skills in both multimedia design and creative programming by combining technology with psychological therapy methods to improve the lives of those suffering from memory loss.

## Features

- Interactive memory table powered by NFC technology
- Seamless integration of visual and audio memory triggers
- Simple, accessible interface tailored to Alzheimer's patients
- Customizable memory experiences for personalized therapy
- Focus on reminiscence therapy to slow down cognitive decline

## Installation Instructions

### Prerequisites
- Node.js (>=12.x.x)
- npm (>=6.x.x)
- A MongoDB database (if your project uses one)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio-tweede-zit-v2-AndyHuizenga
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory and provide the necessary environment variables (e.g., database connection strings).

4. Start the backend server:
   ```bash
   npm run start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm run start
   ```

## Usage Instructions

1. After installing and starting both the backend and frontend, the application should be accessible via a web browser at `http://localhost:3000`.
2. Users can interact with the table through NFC tags that trigger personalized memory experiences.
3. Further usage details can be found in the user guide (if applicable).

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: React, Webpack
- **Database**: MongoDB (or other database if specified)
- **Other**: NFC technology for memory triggers

## Project Structure

```
portfolio-tweede-zit-v2-AndyHuizenga/
│
├── backend/               # Backend server code
├── frontend/              # Frontend client code
├── .gitignore             # Ignored files in Git
├── LICENSE                # Project license
├── Procfile               # Process file for Heroku deployment
├── README.md              # Project documentation (this file)
└── package.json           # Project dependencies and scripts
```

## Contributing

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add YourFeature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions, feel free to reach out via email at [Andy.huizenga@student.ehb.be].