export default class User {
    ID          = null;
    Nickname    = null;
    Gender      = null;
    Age         = null;

    constructor(json) {
        if(typeof(json.id) !== 'undefined') {
            this.ID = json.id;
        }

        if(typeof(json.nick) !== 'undefined') {
            this.Nickname = json.nick;
        }

        if(typeof(json.gender) !== 'undefined') {
            this.Gender = json.gender;
        }

        if(typeof(json.age) !== 'undefined') {
            this.Age = json.age;
        }
    }

    getID() {
        return this.ID;
    }

    getNickname() {
        return this.Nickname;
    }

    getGender() {
        return this.Gender;
    }

    getAge() {
        return this.Age;
    }
}