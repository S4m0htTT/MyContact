import ContactServices from '../src/services/ContactServices';
import Contact from '../src/model/Contact';
import User from '../src/model/User';
import {decodeToken} from '../src/utils/JWTUtils';
import mongoose from 'mongoose';

jest.mock('../src/model/Contact');
jest.mock('../src/model/User');
jest.mock('../src/utils/JWTUtils');

const mockRequest = (
    headers: { [key: string]: string } = {},
    params: { [key: string]: string } = {},
    body: any = {}
) => ({
    get: (key: string) => headers[key],
    params,
    body,
} as any);

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
    });
});

describe('ContactServices', () => {
    const service = new ContactServices();

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserContact', () => {
        it('should return contacts for authenticated user', async () => {
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};
            const user = {_id: new mongoose.Types.ObjectId()};
            const contacts = [{firstName: 'John'}, {firstName: 'Jane'}];

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(user);
            (Contact.find as jest.Mock).mockResolvedValue(contacts);

            const req = mockRequest({Authorization: token});
            const res = await service.getUserContact(req);

            expect(res.success).toBe(true);
            expect(res.statusCode).toBe(200);
            expect(res.data.contact).toEqual(contacts);
        });

        it('should fail if token is missing', async () => {
            const req = mockRequest({});
            const res = await service.getUserContact(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if token is invalid (no email)', async () => {
            const token = 'Bearer invalid.token';

            (decodeToken as jest.Mock).mockReturnValue({});

            const req = mockRequest({Authorization: token});
            const res = await service.getUserContact(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if user is not found', async () => {
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const req = mockRequest({Authorization: token});
            const res = await service.getUserContact(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if Contact.find throws an error', async () => {
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};
            const user = {_id: new mongoose.Types.ObjectId()};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(user);
            (Contact.find as jest.Mock).mockRejectedValue(new Error('DB error'));

            const req = mockRequest({Authorization: token});
            const res = await service.getUserContact(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });
    });

    describe('getContactById', () => {
        it('should return contact if user is authenticated and contact exists', async () => {
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};
            const userId = new mongoose.Types.ObjectId();
            const contactId = new mongoose.Types.ObjectId().toString();
            const contact = {_id: contactId, user: userId, firstName: 'John'};
            const user = {_id: userId};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(user);
            (Contact.findOne as jest.Mock).mockResolvedValue(contact);

            const req = mockRequest({Authorization: token}, {id: contactId});
            const res = await service.getContactById(req);

            expect(res.success).toBe(true);
            expect(res.statusCode).toBe(200);
            expect(res.data.contact).toEqual(contact);

        });

        it('should fail if token is missing', async () => {
            const req = mockRequest({}, {id: '507f1f77bcf86cd799439011'});
            const res = await service.getContactById(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if token is invalid', async () => {
            const token = 'Bearer invalid.token';

            (decodeToken as jest.Mock).mockReturnValue({});

            const req = mockRequest({Authorization: token}, {id: '507f1f77bcf86cd799439011'});
            const res = await service.getContactById(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if user is not found', async () => {
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const req = mockRequest({Authorization: token}, {id: '507f1f77bcf86cd799439011'});
            const res = await service.getContactById(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if contact is not found', async () => {
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};
            const user = {_id: new mongoose.Types.ObjectId()};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(user);
            (Contact.findOne as jest.Mock).mockResolvedValue(null);

            const req = mockRequest({Authorization: token}, {id: '507f1f77bcf86cd799439011'});
            const res = await service.getContactById(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(404);
        });

        it('should fail if Contact.findOne throws an error', async () => {
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};
            const user = {_id: new mongoose.Types.ObjectId()};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(user);
            (Contact.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

            const req = mockRequest({Authorization: token}, {id: '507f1f77bcf86cd799439011'});
            const res = await service.getContactById(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

    });

    describe('createContact', () => {
        it('should create a contact for authenticated user', async () => {
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};
            const user = {_id: new mongoose.Types.ObjectId()};
            const contact = {firstName: 'Alice', user: user._id};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(user);
            (Contact.create as jest.Mock).mockResolvedValue(contact);

            const req = mockRequest({Authorization: token}, {}, contact);
            const res = await service.createContact(req);

            expect(res.success).toBe(true);
            expect(res.statusCode).toBe(201);
            expect(res.data.contact).toEqual(contact);
        });

        it('should fail if token is missing', async () => {
            const req = mockRequest({}, {}, {firstName: 'Alice'});

            const res = await service.createContact(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if token is invalid', async () => {
            const token = 'Bearer invalid.token';

            (decodeToken as jest.Mock).mockReturnValue({});

            const req = mockRequest({Authorization: token}, {}, {firstName: 'Alice'});

            const res = await service.createContact(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if user is not found', async () => {
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const req = mockRequest({Authorization: token}, {}, {firstName: 'Alice'});

            const res = await service.createContact(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if Contact.create throws an error', async () => {
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};
            const user = {_id: new mongoose.Types.ObjectId()};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(user);
            (Contact.create as jest.Mock).mockRejectedValue(new Error('DB error'));

            const req = mockRequest({Authorization: token}, {}, {firstName: 'Alice'});

            const res = await service.createContact(req);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

    });

    describe('deleteContact', () => {
        it('should delete contact if user is authorized', async () => {
            const id = '507f1f77bcf86cd799439011';
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};
            const userId = new mongoose.Types.ObjectId();
            const contact = {_id: id, user: userId};
            const user = {_id: userId};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (User.findOne as jest.Mock).mockResolvedValue(user);
            (Contact.findOne as jest.Mock).mockResolvedValue(contact);
            (Contact.deleteOne as jest.Mock).mockResolvedValue({});

            const res = await service.deleteContact(id, token);

            expect(res.success).toBe(true);
            expect(res.statusCode).toBe(200);
            expect(res.data.message).toBe('Contact deleted successfully.');
        });

        it('should fail if contact does not exist', async () => {
            const id = '507f1f77bcf86cd799439011';
            const token = 'Bearer valid.token';

            (Contact.findOne as jest.Mock).mockResolvedValue(null);

            const res = await service.deleteContact(id, token);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(404);
        });

        it('should fail if token is missing', async () => {
            const id = '507f1f77bcf86cd799439011';
            const contact = { _id: id, user: new mongoose.Types.ObjectId() };

            (Contact.findOne as jest.Mock).mockResolvedValue(contact);
            const res = await service.deleteContact(id, '');
            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if token is invalid', async () => {
            const id = '507f1f77bcf86cd799439011';
            const token = 'Bearer invalid.token';

            const contact = { _id: id, user: new mongoose.Types.ObjectId() };

            (Contact.findOne as jest.Mock).mockResolvedValue(contact);
            (decodeToken as jest.Mock).mockReturnValue({});

            const res = await service.deleteContact(id, token);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if user is not found', async () => {
            const id = '507f1f77bcf86cd799439011';
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};
            const contact = {_id: id, user: new mongoose.Types.ObjectId()};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (Contact.findOne as jest.Mock).mockResolvedValue(contact);
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const res = await service.deleteContact(id, token);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(500);
        });

        it('should fail if user is not authorized to delete contact', async () => {
            const id = '507f1f77bcf86cd799439011';
            const token = 'Bearer valid.token';
            const decoded = {email: 'test@example.com'};
            const contact = {_id: id, user: new mongoose.Types.ObjectId()};
            const user = {_id: new mongoose.Types.ObjectId()};

            (decodeToken as jest.Mock).mockReturnValue(decoded);
            (Contact.findOne as jest.Mock).mockResolvedValue(contact);
            (User.findOne as jest.Mock).mockResolvedValue(user);

            const res = await service.deleteContact(id, token);

            expect(res.success).toBe(false);
            expect(res.statusCode).toBe(403);
        });
    });
});
