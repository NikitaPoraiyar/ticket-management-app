import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { errorLogger } from '../middleware/log.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Formsubmission from '../models/formSubmission.js';
import Teammate from "../models/teammate.js";
import mongoose from 'mongoose';
import Style from '../models/styles.js';
// import { errorLogger } from '../middleware/log.js';



dotenv.config();
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: 'User API is working!' });
});

router.post('/signup', errorLogger, async(req,res) => {
    try{
        const {name, username, email, password} = req.body;
        const existingUser = await User.findOne({ $or: [{username: username}, {email: email}] });
        if(existingUser){
            return res.status(400).json({message: 'User already exists!'});
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name: name,
                username: username,
                email: email,
                password: hashedPassword
            });
            await newUser.save();
            res.status(200).json({message: 'User created successfully!'});
        }
    }
    catch(error){
        errorLogger(error, req, res);
    }
})

router .post('/login', errorLogger, async(req,res) => {
    try{
        const {username, password} = req.body;
        let existingUser = await User.findOne({username: username});
        let userType = "User";

        if(!existingUser){
            existingUser = await Teammate.findOne({username});
            userType = "Teammate";
        }

        if(!existingUser){
            return res.status(400).json({message: 'Invalid Credentials!'});
        }

        const match = await bcrypt.compare(password, existingUser.password);
        if(!match){
            return res.status(400).json({message: 'Invalid Credentials!'});
        }

        const token = jwt.sign({
            id: existingUser._id,
            username: existingUser.username,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            type: userType
        }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "User logged in successfully", token: token, user:{ id: existingUser._id, username: existingUser.username, name: existingUser.name, email: existingUser.email, role: existingUser.role, type: userType } });
    }
    catch(error){
        errorLogger(error, req, res);
    }
});

router.get('/contactcenter', errorLogger, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {  
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user:{
                name: user.name,
                username: user.username,
                email: user.email,
                message: user.message          
            }

        });
    } catch (error) {
        console.log(error);
        errorLogger(error, req, res);
    }
});

router.get('/formsubmissions', errorLogger, async(req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({message: 'Unauthorized'});
        }
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const formsubmissions = await Formsubmission.find().sort({createdAt: -1}).populate('assignedTeammate');

        res.status(200).json({
            formsubmissions:formsubmissions
        });

    }
    catch(error){
        console.log(error);
        errorLogger(error, req, res);
    }
})

router.put('/formsubmissions/:id', errorLogger, async(req,res) => {
    const { id } = req.params;
    const { assignedTeammateId, responseStatus } = req.body;

    try {
        const formSubmission = await Formsubmission.findById(id);
        if (!formSubmission) {
            return res.status(404).json({ message: 'Form submission not found' });
        }

        if (assignedTeammateId) {
            formSubmission.assignedTeammate = mongoose.Types.ObjectId(assignedTeammateId);
        }

        if (responseStatus) {
            formSubmission.responseStatus = responseStatus;
        }

        if (responseStatus && responseStatus !== formSubmission.responseStatus) {
            formSubmission.responseTime = new Date();
        }

        console.log("Updating formSubmission:", {
            id: formSubmission._id,
            assignedTeammate: formSubmission.assignedTeammate,
            responseStatus: formSubmission.responseStatus
        });

        const updatedSubmission = await formSubmission.save();
        await updatedSubmission.populate('assignedTeammate');
        res.status(200).json({ success: true, data: updatedSubmission });

    } catch (error) {
        console.log(error);
        errorLogger(error, req, res);
    }
})

router.post('/formsubmissions/:id/response', async (req, res) => {
    const { responseText } = req.body; 
    const { id } = req.params; 
    try {
        const formSubmission = await Formsubmission.findById(id);

        if (!formSubmission) {
            return res.status(404).json({ message: 'Form submission not found' });
        }

       
        formSubmission.responseText = responseText;
        await formSubmission.save();

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error saving response', error });
    }
});


router.post('/addmember', errorLogger, async(req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({message: 'Unauthorized'});
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const Currentuser = await User.findById(decoded.id);

        if(!Currentuser){
            return res.status(404).json({message: 'User not found'});
        }

        const {  name, email, role } = req.body;
        const username = email.split('@')[0];

        const existing = await Teammate.findOne({$or: [{ username }, { email }]})
        if(existing){
            return res.status(400).json({message: 'User already exists!'});
        }
        
        const newTeammate = new Teammate({
            name,
            username,
            email,
            password: Currentuser.password,
            role: role || "Member"
        });

        await newTeammate.save();

        res.status(200).json({ message: "Teammate added successfully", teammate: newTeammate });
        
    }
    catch(error){
        console.log(error);
        errorLogger(error, req, res);
    }
});

router.delete('/deletemember/:id', errorLogger, async(req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { id } = req.params;

        const updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            { $pull: { teammates: { _id: id } } },
            { new: true }
        );

        await Teammate.findByIdAndDelete(id);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Teammate not found' });
        }

        res.status(200).json({ message: 'Teammate deleted successfully' });
    } catch (error) {
        console.log(error);
        errorLogger(error, req, res);
    }

})


router.get('/teammates', errorLogger, async(req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
    
        if (!user) return res.status(404).json({ message: 'User not found' });
    
        res.status(200).json({ teammates: user.teammates });
    } 
    catch (error) {
        console.log(error);
        errorLogger(error, req, res);
    }
});

router.post('/styles', async(req,res) => {
    const { headerColor, bgColor, message1, message2, welcomeMessage, missedChatTimer } = req.body;
    try{
        const newStyle = new Style({
            headerbgclr: headerColor, 
            bodybgclr: bgColor, 
            message1, 
            message2, 
            welcomemessage: welcomeMessage, 
            missedchattime: missedChatTimer ??"60",
            formlabelname: "Name",      
            formlabelphone: "Phone",
            formlabelemail: "Email"
        });
        const savedStyle = await newStyle.save();
        res.status(201).json({ success: true, data: savedStyle });
    }
    catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
} );

router.get('/styles', async (req, res) => {
    try {
        const styles = await Style.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: styles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/styles/:id', async (req, res) => {
    try {
        const style = await Style.findById(req.params.id);
        if (!style) {
            return res.status(404).json({ success: false, message: 'Style not found' });
        }
        res.status(200).json({ success: true, data: style });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/styles/:id', async (req, res) => {
    try {
        const { headerColor, bgColor, message1, message2, welcomeMessage, missedChatTimer } = req.body;
        
        const updatedStyle = await Style.findByIdAndUpdate(
            req.params.id,
            {
                headerbgclr: headerColor,
                bodybgclr: bgColor,
                message1,
                message2,
                welcomemessage: welcomeMessage,
                missedchattime: missedChatTimer
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedStyle) {
            return res.status(404).json({ success: false, message: 'Style not found' });
        }
        
        res.status(200).json({ success: true, data: updatedStyle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.delete('/styles/:id', async (req, res) => {
    try {
        const style = await Style.findByIdAndDelete(req.params.id);
        if (!style) {
            return res.status(404).json({ success: false, message: 'Style not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.post('/updatePassword', errorLogger, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { newPassword } = req.body;
        if (!newPassword || typeof newPassword !== 'string') {
            return res.status(400).json({ message: 'New password is required and must be a string' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(400).json({ message: 'New password must be different from the current password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ _id: decoded.id }, { $set: { password: hashedNewPassword } });

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Password update failed:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});









export default router;