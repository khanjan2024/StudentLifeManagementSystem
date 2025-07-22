const Assignment = require('../models/assignmentSchema');
const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');
const Branch = require('../models/sclassSchema');
const Subject = require('../models/subjectSchema');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/assignments/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
exports.upload = upload;

// Teacher creates assignment
exports.createAssignment = async (req, res) => {
    try {
        const assignment = new Assignment({ ...req.body });
        const result = await assignment.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get assignments for a branch/subject (for students/teachers)
exports.getAssignments = async (req, res) => {
    try {
        const { branch, subject, teacher } = req.query;
        const filter = {};
        if (branch) filter.branch = branch;
        if (subject) filter.subject = subject;
        if (teacher) filter.teacher = teacher;
        const assignments = await Assignment.find(filter).populate('teacher', 'name').populate('subject', 'subName').populate('branch', 'branch semester');
        res.json(assignments);
    } catch (err) {
        console.error('Error fetching assignments:', err);
        res.status(500).json({ message: err.message });
    }
};

// Student submits assignment (fileUrl or text)
exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { student, text } = req.body;
        let fileUrl = null;
        if (req.file) {
            fileUrl = path.join('/uploads/assignments/', req.file.filename);
        }
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        // Prevent duplicate submissions by same student
        const alreadySubmitted = assignment.submissions.some(sub => sub.student.toString() === student);
        if (alreadySubmitted) return res.status(400).json({ message: 'Already submitted' });
        assignment.submissions.push({ student, fileUrl, text });
        await assignment.save();
        res.json({ message: 'Submission successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Teacher views submissions for an assignment
exports.getSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId).populate('submissions.student', 'name rollNum');
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        res.json(assignment.submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Teacher deletes assignment
exports.deleteAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        
        await Assignment.findByIdAndDelete(assignmentId);
        res.json({ message: 'Assignment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 