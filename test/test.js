const common = require('./common');
const chai = common.chai;
const server = common.server;

const Profile = require('../src/models/profile');
const Address = require('../src/models/address');
const Image = require('../src/models/image');
const User = require('../src/models/user');
const Rating = require('../src/models/rating');
const Device = require('../src/models/device');
const Group  = require('../src/models/group');
const Group_Settings  = require('../src/models/group-settings');
const Password_Reset = require('../src/models/password-reset')
const Member = require('../src/models/member')

const importTest = (name, path) => {
	describe(name, () => {
			require(path);
	});
}

const initializeDB = async () => {
	const user2 = {
		given_name: "Test",
		family_name: "User2",
		number: "0123546879",
		email: "test2@email.com",
		password: "password",
		visible: true,
		language: "en",
	};
	const user3 = {
		given_name: "Test",
		family_name: "User3",
		number: "0123546879",
		email: "test3@email.com",
		password: "password",
		visible: true,
		language: "en",
	};
	await chai.request(server).post('/users').send(user2);
	await chai.request(server).post('/users').send(user3);
	const user = await User.findOne({email:"test3@email.com"});
	const group2= {
		name: "Test Group 2",
		description: "Also awesome group",
		visible: true,
		location: "Kuala lumpur",
		owner_id: user.user_id,
		invite_ids: [],
	};
	const group3 = {
		name: "Test Group 3",
		description: "Again an awesome group",
		visible: true,
		location: "Kuala lumpur",
		owner_id: user.user_id,
		invite_ids: [],
	};
	await chai.request(server).post('/groups').send(group2).set('Authorization', user.token);
	await chai.request(server).post('/groups').send(group3).set('Authorization', user.token);
}

describe("Test", function () {
	before( async () =>{
		await initializeDB();
	});
	importTest("User Model Test", './Users/userModel');
	importTest("Group Model Test", './Groups/groupModel');
	after(async () => {
		await User.deleteMany({});
		await Profile.deleteMany({});
		await Image.deleteMany({});
		await Rating.deleteMany({});
		await Address.deleteMany({});
		await Device.deleteMany({});
		await Password_Reset.deleteMany({});
		await Group.deleteMany({});
		await Group_Settings.deleteMany({});
		await Member.deleteMany({});
	});
});