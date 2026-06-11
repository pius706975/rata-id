import nodemailer from 'nodemailer';
import { sendEmail } from '../../utils/email';

const sendMailMock = jest.fn();

jest.mock('nodemailer', () => {
  return {
    __esModule: true,
    default: {
      createTransport: jest.fn(() => ({
        sendMail: sendMailMock,
      })),
    },
  };
});

describe('sendEmail', () => {
  beforeEach(() => {
    process.env.MAILER_HOST = 'smtp.test.com';
    process.env.MAILER_PORT = '587';
    process.env.MAILER_EMAIL = 'test@mail.com';
    process.env.MAILER_PASSWORD = 'secret';

    sendMailMock.mockReset();
  });

  it('should send email successfully', (done) => {
    sendMailMock.mockImplementation((_, cb) => cb(null, { response: 'OK' }));

    sendEmail(
      'user@mail.com',
      'Subject',
      'Hello world',
      (err, info) => {
        expect(err).toBeNull();
        expect(info).toEqual({ response: 'OK' });
        expect(sendMailMock).toHaveBeenCalled();
        done();
      },
    );
  });

  it('should handle error', (done) => {
    const errorMock = new Error('SMTP error');
    sendMailMock.mockImplementation((_, cb) => cb(errorMock, null));

    sendEmail(
      'user@mail.com',
      'Subject',
      'Hello world',
      (err, info) => {
        expect(err).toBe(errorMock);
        expect(info).toBeNull();
        done();
      },
    );
  });
});