const pool=require('../DB/connectDB');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const queries=require('./queries')

const getUsers=async (req,res)=>{
    try{
        const userData=await pool.query(queries.getUserData);
        if(!userData){
            return res.status(400).json({error:"User with this id does not Exist"});
        }
        res.status(200).json(userData.rows);
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getUserById=async (req,res)=>{
    try{
        const id=parseInt(req.params.id);
        const singleUser=await pool.query(queries.getUserById, [id]);
        if(!singleUser){
            return res.status(400).json({error:"User with this id does not Exist"});
        }
        res.status(200).json(singleUser.rows);
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
}

const registerUser=async (req,res)=>{
    try {
        const { username, email, password } = req.body;
    
        if (!username || !email || !password) {
          return res.status(400).json({ error: 'Username, email, and password are required.' });
        }
        const emailExists = await pool.query(queries.emailIsExist, [email]);
        if (emailExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists. Please choose a different email.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(queries.registerUser, [username, email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully.' });
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const loginUser=async(req,res)=>{
    try {
        const {email, password } = req.body;
        const secret=process.env.secret;
    
        if (!email || !password) {
          return res.status(400).json({ error: 'Email, and password are required.' });
        }
        const results = await pool.query(queries.emailIsExist, [email]);
        if(results.length===0){
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const user=results.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // console.log(user);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ userId: user.user_id, email: user.email }, secret, { expiresIn: '1h' });
        res.status(200).json({ userId:user.user_id,token: token });
      } catch (error) {
        console.error('Error Login user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}


module.exports={getUsers,getUserById,registerUser,loginUser};