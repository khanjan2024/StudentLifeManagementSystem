const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fs = require("fs")
const path = require("path")
// const bodyParser = require("body-parser")
const app = express()
const Routes = require("./routes/route.js")
const logger = require("./utils/logger")

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    logger.error('Missing required environment variables:', { missingVars: missingEnvVars });
    logger.error('Please check your .env file or environment configuration.');
    process.exit(1);
}

const PORT = process.env.PORT || 5000

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))

// Configure CORS based on environment
if (process.env.NODE_ENV === 'production') {
    // In production, only allow specific origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
        process.env.ALLOWED_ORIGINS.split(',') : 
        ['https://student-life-management-system.onrender.com'];
    
    app.use(cors({
        origin: function(origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true
    }));
    
    // Add security headers in production
    app.use((req, res, next) => {
        // Helps prevent clickjacking attacks
        res.setHeader('X-Frame-Options', 'DENY');
        // Helps prevent XSS attacks
        res.setHeader('X-XSS-Protection', '1; mode=block');
        // Prevents browser from MIME-sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff');
        // Strict Transport Security
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        // Content Security Policy
        res.setHeader('Content-Security-Policy', "default-src 'self'");
        next();
    });
} else {
    // In development, allow all origins
    app.use(cors());
}

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const assignmentsDir = path.join(__dirname, 'uploads/assignments');

try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
        logger.info('Created uploads directory');
    }
    if (!fs.existsSync(assignmentsDir)) {
        fs.mkdirSync(assignmentsDir);
        logger.info('Created assignments upload directory');
    }
} catch (err) {
    logger.error('Error creating upload directories:', { error: err.message });
}

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => logger.info("Connected to MongoDB"))
    .catch((err) => logger.error("Database connection failed", { error: err.message }))

app.use('/', Routes);
app.use('/uploads/assignments', express.static('uploads/assignments'));

app.listen(PORT, () => {
    logger.info(`Server started successfully`, { 
        port: PORT, 
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
})