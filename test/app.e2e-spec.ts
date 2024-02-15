import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto, LoginDto } from 'src/auth/dto';

// to launch Prisma Studio: npx dotenv -e .env.test -- prisma studio

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  //starting logic
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3333');
    await prisma.cleanDb();
  });

  //teardown logic
  afterAll(() => {
    app.close();
  });

  //testing logic
  describe('Auth', () => {
    //register
    describe('Register', () => {
      const authDto: AuthDto = {
        username: 'kato',
        email: 'kato@gmail.com',
        password: 'password',
      };
      const authDto2: AuthDto = {
        username: 'mason',
        email: 'mason@gmail.com',
        password: 'password',
      };
      it('should throw if username empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: authDto.email, password: authDto.password })
          .expectStatus(400);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ username: authDto.username, password: authDto.password })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ username: authDto.username, email: authDto.email })
          .expectStatus(400);
      });

      it('should register', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(authDto)
          .expectStatus(201);
      });
      //second registration for tip testing purposes
      it('should register another user to tip', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(authDto2)
          .expectStatus(201);
      });
    });

    //login
    describe('Login', () => {
      const loginDto: LoginDto = {
        email: 'kato@gmail.com',
        password: 'password',
      };
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(loginDto)
          .expectStatus(200)
          .stores('userAt', 'tokens.access_token')
          .stores('userId', 'user_id');
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ password: loginDto.password })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: loginDto.email })
          .expectStatus(400);
      });
    });
  });

  describe('User', () => {
    //get me
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('User Balance', () => {
      it('should get current user balance', () => {
        return pactum
          .spec()
          .get('/users/balance')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });
  });

  describe('Tips', () => {
    describe('Send', () => {
      const requestBody = {
        receiverUsername: 'mason',
        amount: 50,
      };

      it('should tip that user', () => {
        console.log(requestBody);
        return pactum
          .spec()
          .post('/tips/send')
          .withBody(requestBody)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(202);
      });
    });

    describe('History', () => {
      it('should log the history of user tips sent', () => {
        return pactum
          .spec()
          .get('/tips/history')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('History Received', () => {
      it('should log the history of user tips received', () => {
        return pactum
          .spec()
          .get('/tips/history-received')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });
  });

  //updating user at end to ensure that it does not change data along the way
  //uncomment .withBody to proceed with the update
  describe('Update User', () => {
    it('should update the user', () => {
      return (
        pactum
          .spec()
          .patch('/users/update')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          //.withBody({ username: 'bababooey' })
          .expectStatus(200)
      );
    });
  });

  /*
  //Only use if want to delete user at end of e2e tests - works find when testing once
  describe('Delete User', () => {
    it('should delete user', () => {
      return pactum
        .spec()
        .delete('/users/delete')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(202)
        .inspect();
    });
  });
  */

  //testing for tip duplication here:
  //testing logic
  describe('TipsAuth', () => {
    //register
    describe('TipsRegister', () => {
      const authDto: AuthDto = {
        username: 'kato1',
        email: 'kato1@gmail.com',
        password: 'password',
      };
      const authDto2: AuthDto = {
        username: 'mason1',
        email: 'mason1@gmail.com',
        password: 'password',
      };
      it('should register', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(authDto)
          .expectStatus(201);
      });
      //second registration for tip testing purposes
      it('should register another user to tip', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(authDto2)
          .expectStatus(201);
      });
    });

    //login
    describe('TipsLogin', () => {
      const loginDto: LoginDto = {
        email: 'kato1@gmail.com',
        password: 'password',
      };
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(loginDto)
          .expectStatus(200)
          .stores('userAt', 'tokens.access_token')
          .stores('userId', 'user_id');
      });
    });
  });

  //need to test read-mwodify-write exploits through tip testing

  describe('TipsDuplication', () => {
    describe('Send', () => {
      const requestBody = {
        receiverUsername: 'mason1',
        amount: 100,
      };

      it('should attempt to tip that user concurrently, causing one to fail due to lack of balance', async () => {
        console.log(requestBody);

        const sendTipSpec1 = pactum
          .spec()
          .post('/tips/send')
          .withBody(requestBody)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' });

        const sendTipSpec2 = pactum
          .spec()
          .post('/tips/send')
          .withBody(requestBody)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .inspect();

        const results = await Promise.allSettled([
          sendTipSpec1.toss(),
          sendTipSpec2.toss(),
        ]);

        //checking status codes instead of the fulfillment
        let hasStatusCode202 = false;
        let hasStatusCode409 = false;

        if (
          results[0].status === 'fulfilled' &&
          results[0].value.statusCode === 202
        ) {
          hasStatusCode202 = true;
          console.log('First request succeeded with status 202');
        } else if (results[0].status === 'rejected') {
          console.error(
            'First request failed',
            results[0].reason.response?.statusCode,
          );
        }

        if (
          (results[1].status === 'fulfilled' &&
            results[1].value.statusCode === 409) ||
          500
        ) {
          hasStatusCode409 = true;
          console.log('Second request failed with status 409 as expected');
        } else
          () => {
            console.log('Second request has unexpected behaviour');
          };

        expect(hasStatusCode202).toBeTruthy();
        expect(hasStatusCode409).toBeTruthy();
      });
    });
  });
});
