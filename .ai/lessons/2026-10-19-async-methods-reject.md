# Promise-returning methods must reject, not throw

`MentorService.register` was declared `(): Promise<Mentor>` but validated input synchronously and threw, so
`service.register(bad).catch(...)` or `assert.rejects(service.register(bad))` never saw a rejection. Declare such
methods `async` so every failure becomes a rejected promise. The first unit tests found this.
