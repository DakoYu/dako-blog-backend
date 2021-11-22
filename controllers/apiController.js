const { promisify } = require('util');
const path = require('path');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userSchema');
const multer = require('multer');
const sharp = require('sharp');

const loginToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createToken = (user, statusCode, res) => {
    const token = loginToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        user
    });
}

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        errorResponse(res,req, 'Invalid Image', 400);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports. uploadUserPhoto = upload.single('photo');

exports. resizeUserPhoto = catchAsync(async(req, res, next) => {
    if (!req.file) return next();
    
    req.file.filename = `user-${req.body.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/users/${req.file.filename}`);

    next();
});

const errorResponse = (res, req, message, statusCode) => {
    return res.status(statusCode).json({
        status: 'error',
        message
    });
}

exports. login = catchAsync(async(req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password) {
        return errorResponse(res, req, 'Please provide email and password', 400);
    };

    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))){
        return errorResponse(res, req, 'Incorrect email or password', 401);
    };

    createToken(user, 201, res);
});

exports. signup = catchAsync(async(req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmedPassword: req.body.confirmedPassword
    });

    createToken(newUser, 201, res);
});

exports. updatePassword = catchAsync(async(req, res) => {
    const { token, currentPwd, newPwd, confirmedPwd } = req.body;

    if(!token) {
        return errorResponse(res, req, 'Invalid token', 401);
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('+password');;
    if(await(!user.correctPassword(currentPwd, newPwd))) {
        return errorResponse(res, req, 'Invalid user', 401);
    };

    user.password = newPwd;
    user.confirmedPassword = confirmedPwd;
    await user.save();

    createToken(user, 200, res);
});

exports. updateMe = catchAsync(async(req, res) => {
    const filteredObj = {
        name: req.body.name,
        email: req.body.email
    };
 
    if (req.file) filteredObj.photo = req.file.filename;

    await User.findByIdAndUpdate(req.body.id, filteredObj, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
    });
});

exports. protect = catchAsync(async(req, res, next) => {
    const {token} = req.body;

    if(!token) {
        return errorResponse(res, req, 'Invalid token', 401);
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if(!user) {
        return errorResponse(res, req, 'Invalid user', 401);
    };

    res.status(200).json({
        status: 'success',
        user
    });
});

exports. user = catchAsync(async(req, res, next) => {
    const token = req.params.user;

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    res.status(200).json({
        status: 'success',
        name: user.name,
        email: user.email
    });
});

exports. userImage = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.user);

    res.sendFile(path.join(__dirname, '../public/img/users', user.photo));
})