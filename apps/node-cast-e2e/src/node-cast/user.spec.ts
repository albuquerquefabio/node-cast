import axios from 'axios';

describe('User API', () => {
  const now = Date.now().toString();
  let user;

  const userDto = {
    name: 'Jack Daniel',
    username: 'jackdaniel' + now,
    email: `jack.daniel.${now}@example.com`,
    password: 'password123',
  };

  describe('[POST] /users', () => {
    it('should create user', async () => {
      const { data } = await axios.post(`/v1/api/users`, userDto);
      user = data;
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('createdAt');
      expect(data).toHaveProperty('updatedAt');
      expect(data.name).toBe(userDto.name);
      expect(data.username).toBe(userDto.username);
      expect(data.email).toBe(userDto.email);
      expect(data.roles).toEqual(['user']);
    });

    it('should not be able to duplicate user data', async () => {
      try {
        await axios.post(`/v1/api/users`, userDto);
        fail('Expected request to fail, but it succeeded');
      } catch (error) {
        const { response } = error;
        expect(response.status).toEqual(500);
        // expect(response.statusText).toEqual('Internal Server Error');
        expect(response.data).toHaveProperty('message');
        expect(response.data.message).toEqual('Internal server error');
      }
    });
  });

  describe('[GET] /users', () => {
    it('should list all users', async () => {
      const { data, status, statusText } = await axios.get(`/v1/api/users`);

      expect(status).toEqual(200);
      expect(statusText).toEqual('OK');
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      if (data.length > 0) {
        const user = data[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
      }
    });
  });

  describe('[GET] /users/:id', () => {
    it('should return the same user saved before', async () => {
      const { data } = await axios.get(`/v1/api/users/${user.id}`);

      expect(data).toEqual(user);
    });
  });
});
