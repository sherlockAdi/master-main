try {
  require('./departmentController');
  console.log('departmentController loaded successfully');
} catch (e) {
  console.error('Error loading departmentController:', e);
}

try {
  require('./designationController');
  console.log('designationController loaded successfully');
} catch (e) {
  console.error('Error loading designationController:', e);
} 