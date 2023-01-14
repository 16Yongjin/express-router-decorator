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

  describe('/cats 라우터 테스트', () => {
    test('GET /cats 고양이 목록을 가져올 수 있다.', async () => {
      const res = await request(application.instance)
        .get('/cats')
        .expect('Content-Type', /json/);

      expect(res.body.cats).toHaveLength(2);
    });

    test('GET /cats/Tom 이름이 Tom인 고양이를 가져올 수 있다.', async () => {
      const res = await request(application.instance)
        .get('/cats/Tom')
        .expect('Content-Type', /json/);

      expect(res.body.cat).toEqual({ name: 'Tom' });
    });

    test('POST /cats Dave라는 고양이를 추가할 수 있다.', async () => {
      await request(application.instance)
        .post('/cats')
        .send({ name: 'Dave' })
        .expect(204);

      const res = await request(application.instance)
        .get('/cats/Dave')
        .expect('Content-Type', /json/);

      expect(res.body.cat).toEqual({ name: 'Dave' });
    });
  });
});
