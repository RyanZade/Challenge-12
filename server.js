const mysql = require('mysql2');
const cTable = require('console.table');
const inq = require('inquirer');

const connection = mysql.createConnection({
    host: 'localHost',
    user: 'root',
    password: 'rimfcftw1',
    database: 'employer_tracker'
})

const initalQuestions = [{
    type: 'list',
    name: 'option',
    message: 'Select operation to perform',
    choices: [
        'View all Departments', 'View all Employees', 'View all Roles', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee'
    ]
}
];

function init(){
    inq.prompt(initalQuestions).then(answer => {
        if(answer.option === 'View all Employees'){
            viewAllEmployees();
        } else if(answer.option === 'View all Departments'){
            viewAllDept();
        } else if(answer.option === 'View all Roles'){
            viewAllRole();
        } else if(answer.option === 'Add a Department'){
            addDept();
        } else if(answer.option === 'Add a Role'){
            addRole();
        } else if(answer.option === 'Add an Employee'){
            addEmp();
        } else if(answer.option === 'Update an Employee'){
            updateEmp();
        }
    })
};

function viewAllEmployees(){
    connection.query('SELECT * FROM employee;', function(err, data){
        if (err) console.log(err);

        console.table(data)
        init();
    })
};

function viewAllDept(){
    connection.query('SELECT * FROM department;', function(err, data){
        if (err) console.log(err);

        console.table(data)
        init();
    })
};

function viewAllRole(){
    connection.query('SELECT * FROM role;', function(err, data){
        if (err) console.log(err);

        console.table(data)
        init();
    })
};

let addDeptQ = [{
    type: 'input',
    name: 'dept_name',
    message: 'Enter Department Name: '
}];

function addDept(){
    
    inq.prompt(addDeptQ).then(answer => {
        let deptName = answer.dept_name;
        connection.query(`INSERT INTO department(dept_name) VALUES('${deptName}');`, function(err, data){
            if (err) console.log(err);
    
            console.table(data)
            init();
        })
    })
};

function addRole(){
    connection.query(`SELECT * FROM department;`, function(err, data){
        if (err) console.log(err);

        let department_choices = data.map(department => {
            return {
                name: department.dept_name,
                value: department.id
            }
        })
        console.log(department_choices);

        let addRoleQ = [{
            type: 'input',
            name: 'title',
            message: 'Enter Role Title: '
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter Role Salary: '
        },
        {
            type: 'list',
            name: 'deptID',
            message: 'Select department for role: ',
            choices: department_choices
        }]

        inq.prompt(addRoleQ).then(answer => {
            let query = `INSERT INTO role(title, salary, department_id) VALUES ('${answer.title}', ${answer.salary}, ${answer.deptID});`
            connection.query(query, function(err, data){
                if (err) console.log(err);
                
                console.table(data);
                init();
            })
        })
    })
};

function addEmp(){
    connection.query(`SELECT * FROM role;`, function(err, data){
        if (err) console.log(err);

        let roleChoices = data.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        });

        connection.query(`SELECT * FROM employee;`, function(err, data){
            if (err) console.log(err);

            let managerList = data.map(employee => {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id 
                }
            });

            let addEmployeeQuestion = [
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter First Name of Employee: '
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter Last Name of Employee: '
                },
                {
                    type: 'list',
                    name: 'manager_Id',
                    message: 'Select manager for the Employee: ',
                    choices: managerList
                },
                {
                    type: 'list',
                    name: 'role_Id',
                    message: 'Select role to update: ',
                    choices: roleChoices
                }
            ];

            inq.prompt(addEmployeeQuestion).then(answer => {
                connection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('${answer.firstName}', '${answer.lastName}', ${answer.role_Id}, ${answer.manager_Id});`, function(err, data){
                    if (err) console.log(err);
                    
                    console.log('employee added successfully');
                    init();
                })
            })
        })
    })
};

function updateEmp(){
    connection.query(`SELECT * FROM role;`, function(err, data){
        if (err) console.log(err);

        let roleChoices = data.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        });

        connection.query(`SELECT * FROM employee;`, function(err, data){
            if (err) console.log(err);

            let employeeList = data.map(employee => {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id 
                }
            });

            let updateQuestion = [
                {
                    type: 'list',
                    name: 'emp_Id',
                    message: 'Select employee to update: ',
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role_Id',
                    message: 'Select role to update: ',
                    choices: roleChoices
                }
            ];

            inq.prompt(updateQuestion).then(answer => {
                connection.query(`UPDATE employee SET role_id=${answer.role_Id} WHERE id=${answer.emp_Id};`, function(err, data){
                    if (err) console.log(err);
                    
                    console.log('employee role updated successfully');
                    init();
                })
            })
        })
    })
}

init();