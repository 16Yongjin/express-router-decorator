import 'reflect-metadata';
import application from '../src/application';
import request from 'supertest';

describe('express 라우터 테스트', () => {
  test('GET /는 Hello world! 메시지를 반환한다.', async () => {
    const res = await request(application.instance)
      .get('/')
      .expect('Content-Type', /json/);

    expect(res.body).toEqual({ message: 'Hello world!' });
  });
});
