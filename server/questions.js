
var Question = {}

exports.createQuestion = async (req, res, next) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({
            success: true,
            data: question
        });
    } catch (err) {
        res.status(400).json({
            success: false
        });
    }
};

// @desc Get all questions
// @route GET /api/v1/questions
exports.getQuestions = async (req, res, next) => {
    try {
        const questions = await Question.find();
        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (err) {
        res.status(400).json({
            success: false
        });
    }
};

// // @desc Get single question
// // @route GET /api/v1/questions/:id
// exports.getQuestion = async (req, res, next) => {
//     try {
//         const question = await Question.findById(req.params.id);

//         if (!question) {
//             return res.status(400).json({
//                 success: false
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: question
//         });
//     } catch (err) {
//         res.status(400).json({
//             success: false
//         });
//     }
// };

// // @desc Update a question
// // @route PUT /api/v1/questions/:id
// exports.updateQuestion = async (req, res, next) => {
//     try {
//         const question = await Question.findByIdAndUpdate(req.params.id, req.body);

//         if (!question) {
//             return res.status(400).json({
//                 success: false
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: question
//         });
//     } catch (err) {
//         res.status(400).json({
//             success: false
//         });
//     }
// };

// // @desc Delete a question
// // @route DELETE /api/v1/questions/:id
// exports.deleteQuestion = async (req, res, next) => {
//     try {
//         const question = await Question.findByIdAndDelete(req.params.id);

//         if (!question) {
//             return res.status(400).json({
//                 success: false
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: question
//         });
//     } catch (err) {
//         res.status(400).json({
//             success: false
//         });
//     }
// };
