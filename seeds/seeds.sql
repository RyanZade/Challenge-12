INSERT INTO department(dept_name)
VALUES('hr'),( 'technology'),('finance'),('law');

INSERT INTO role(title, salary, department_id)
VALUES  ('software engineer', 70000, 2),
        ('hr manager', 75000, 1),
        ('financial analyst', 85000, 3),
        ('lawer', 75000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ('david','becham', 2, NULL),
        ('will', 'smith', 4, NULL),
        ('andrew', 'brown', 1, NULL),
        ('john', 'doe', 1, 3),
        ('philip', 'hughes', 3, NULL),
        ('jeff', 'besos', 4, 2);