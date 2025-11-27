import bcrypt from 'bcrypt'; 
const password = '12345'; 
(async () => {
	const hashedPassword = await bcrypt.hash(password, 10); 
	console.log(hashedPassword); // Use this in your database
})();