class User:
    def __init__(self, first_name, middle_name, last_name, email, dob, sex, occupation):
        self.first_name = first_name
        self.middle_name = middle_name  # Not required
        self.last_name = last_name
        self.email = email
        self.dob = dob
        self.sex = sex
        self.occupation = occupation

    def to_dict(self):
        return {
            "first_name": self.first_name,
            "middle_name": self.middle_name,
            "last_name": self.last_name,
            "email": self.email,
            "dob": self.dob,
            "sex": self.sex,
            "occupation": self.occupation,
        }
