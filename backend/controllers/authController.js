const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const redisClient = require("../config/redis"); 
const crypto = require("crypto");

/* ======================
   REGISTER
   ====================== */
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         message: "Email is already registered"
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     await User.create({
//       name,
//       email,
//       password: hashedPassword
//     });

//     res.status(201).json({
//       message: "Registration successful"
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Registration failed"
//     });
//   }
// };





exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

  res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});


  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Login failed"
    });
  }
};


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔹 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 🔹 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered"
      });
    }


    
    // 🔹 3. Prevent multiple OTP requests
 const cooldown = await redisClient.get(`otp_cooldown:${email}`);

if (cooldown) {
  return res.status(400).json({
    message: "Please wait 30 seconds before requesting again"
  });
}

// set cooldown
await redisClient.set(`otp_cooldown:${email}`, "1", { EX: 30 });




    // 🔹 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 5. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔹 6. Store in Redis
    await redisClient.set(
      `otp:${email}`,
      JSON.stringify({
        name,
        email,
        hashedPassword,
        otp,
      }),
      { EX: 600 } // 10 minutes
    );

    console.log("OTP stored:", otp);

    // 🔹 7. Send email (Brevo)
    await sendEmail({
      email,
      subject: "Verify your email",
      html: `
        <div style="font-family:sans-serif; max-width:400px; margin:auto; padding:20px;">
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="text-align:center;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    // 🔹 8. Response
    res.status(200).json({
      message: "OTP sent to your email"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Registration failed"
    });
  }
};




exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const data = await redisClient.get(`otp:${email}`);

    if (!data) {
      return res.status(400).json({
        message: "OTP expired or not found"
      });
    }

    const parsed = JSON.parse(data);

    if (parsed.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    await User.create({
      name: parsed.name,
      email: parsed.email,
      password: parsed.hashedPassword,
    });

    await redisClient.del(`otp:${email}`);

    res.json({
      message: "Account created successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Verification failed"
    });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token not provided' });
    }

    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      if (user.authProvider === 'local' && !user.googleId) {
        user.googleId = googleId;
        user.avatar = avatar;
        await user.save();
      }
      
      const jwtToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        authProvider: 'google',
      });

      const jwtToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};

/* ======================
   FORGOT PASSWORD
   ====================== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 to prevent email enumeration
      return res.status(200).json({ message: "If that email is in our database, we will send a password reset OTP." });
    }

    if (user.authProvider === 'google') {
      return res.status(400).json({ message: "This account was created with Google. Please log in with Google." });
    }

    // Cooldown check
    const cooldownKey = `reset_cooldown:${email}`;
    const cooldown = await redisClient.get(cooldownKey);
    if (cooldown) {
      return res.status(429).json({ message: "Please wait 60 seconds before requesting again" });
    }
    await redisClient.set(cooldownKey, "1", { EX: 60 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Store hashed OTP in Redis with 10 mins expiry
    await redisClient.set(`password-reset-otp:${email}`, hashedOtp, { EX: 600 });
    
    // Attempt tracking
    await redisClient.del(`reset_attempts:${email}`);

    await sendEmail({
      email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family:sans-serif; max-width:400px; margin:auto; padding:20px;">
          <h2>LPU Quora - Password Reset</h2>
          <p>Your password reset OTP is:</p>
          <h1 style="text-align:center;">${otp}</h1>
          <p>This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "If that email is in our database, we will send a password reset OTP." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const attemptsKey = `reset_attempts:${email}`;
    const attempts = await redisClient.incr(attemptsKey);
    if (attempts === 1) {
      await redisClient.expire(attemptsKey, 600); // 10 mins window
    }
    if (attempts > 5) {
      return res.status(429).json({ message: "Too many failed attempts. Please request a new OTP later." });
    }

    const storedHashedOtp = await redisClient.get(`password-reset-otp:${email}`);
    if (!storedHashedOtp) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    const inputHashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (storedHashedOtp !== inputHashedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified successfully
    await redisClient.del(`password-reset-otp:${email}`);
    await redisClient.del(attemptsKey);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await redisClient.set(`password-reset-token:${email}`, hashedResetToken, { EX: 900 }); // 15 mins

    res.status(200).json({
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (err) {
    console.error("Verify reset OTP error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword, confirmPassword } = req.body;

    if (!email || !resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const storedHashedToken = await redisClient.get(`password-reset-token:${email}`);
    if (!storedHashedToken) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const inputHashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    if (storedHashedToken !== inputHashedToken) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await redisClient.del(`password-reset-token:${email}`);

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};