const bcrypt = require('bcrypt');

const password = 'newpassword';
const hashedPassword = '$2b$10$YS8vGxh50bxSAfraAKIRJeRrCwFcvIcj1MdsLoeJoWtepsoxgDcdC'; // Use a known hash for comparison

async function testBcrypt() {
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(password, salt);
    console.log('Generated Hashed Password:', newHashedPassword);

    const isMatch = await bcrypt.compare(password, newHashedPassword);
    console.log('Password match check (new hash):', isMatch);

    const isMatchOld = await bcrypt.compare(password, hashedPassword);
    console.log('Password match check (old hash):', isMatchOld);
}

testBcrypt();
