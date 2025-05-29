# BackOFFice Balm  

![Backoffice-balm](https://github.com/user-attachments/assets/361a9c68-05d1-4e2e-9906-25179d117f9e)

*Soothe your spine—and your spreadsheets.*

## Introduction  
BackOFFice Balm is a minimal Node.js/Express demo illustrating the **Unvalidated Dynamic Method Call** vulnerability in JavaScript. It exposes two unprotected routes that allow any method on our in-memory `UserManager` to be invoked via URL parameters, including the admin-only `_admin_delete`. Your task is to learn how to exploit and then fix this flaw.

### What is Unvalidated Dynamic Method Call  
An unvalidated dynamic method call happens when an application constructs a method name from user-controlled input and invokes it without checking against a whitelist.  

```js
// vulnerable pattern in src/app.js
const method = `${action}_user`;
userManager[method](params);
```

Because action comes directly from the URL, an attacker can invoke any method on userManager—including private/admin routines like `_admin_delete`—without authorization.

### What is the impact for companies?

- Privilege escalation: Attackers invoke admin-only logic from public endpoints.

- Data loss or tampering: Unauthorized deletion or modification of records.

- Business logic bypass: Security, validation, and audit checks can be skipped.

- Hidden risk: Concise code hides critical security holes, often slipping into production unnoticed.

## Quickstart  

1. **Clone & build**  
```bash
git clone https://github.com/yourname/backoffice-balm.git
cd backoffice-balm
docker build -t backoffice-balm .
```

2. **Run with Docker**

```bash
docker run --rm -it --init \
 --env-file .env \
 -p 3000:3000 \
 backoffice-balm
```

3. **Open the UI**
Browse to http://localhost:3001

## Exploitation

Because we dynamically resolve `userManager[ action ]` without validation, you can call admin methods on the public routes:

```bash
# Create a test user
curl -X POST localhost:3000/v1/user/42/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","cellphone":"+55"}'

# Exploit: delete without auth
curl -X GET localhost:3000/v1/user/42/_admin_delete
```

## Your Challenge

**Patch** `src/app.js` so that only `/v1/user/:id/:action` can invoke `create_user` and `get_user_info`.

Good luck—and hack the planet! 🚀
