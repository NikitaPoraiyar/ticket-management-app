import express from 'express';
import FormSubmission from '../models/formSubmission.js';

const router = express.Router();

router.post('/formSubmission', async (req, res) => {
    try{
        const { name, phone, email, message } = req.body;
        console.log("Received form data:", req.body);
    
        const newFormSubmission = new FormSubmission({
            name,
            phone,
            email,
            message: {
                text: ""
            }
        });
        await newFormSubmission.save();
    
        return res.status(200).json({ id: newFormSubmission._id });
    }
    catch (error) {
        console.error("Error for form submission:", error);
        res.status(500).json({ message: 'Error submitting the form' });
    }
    

})

router.put('/formSubmission/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const updated = await FormSubmission.findByIdAndUpdate(
            id,
            { 
                message: { 
                    text: message,
                    timestamp: Date.now()
                }
            },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating message' });
    }
});

router.post('/formSubmission/:id/message', async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const updated = await FormSubmission.findByIdAndUpdate(
            id,
            { 
                message: { 
                    text: message.text,
                    timestamp: message.timestamp
                }
            },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating message' });
    }
});


export default router;

