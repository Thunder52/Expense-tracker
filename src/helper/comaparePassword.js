import bcrypt from 'bcrypt'

const comparePassword=(password,hashedPassword)=>{
    const isMatch=bcrypt.compare(password,hashedPassword);
    return isMatch;
}

export default comparePassword;