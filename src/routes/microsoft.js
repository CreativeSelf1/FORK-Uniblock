import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const loginRouter = Router();

loginRouter.get(
  "/microsoft",
  passport.authenticate("auth-microsoft", {
    prompt: "select_account",
    session: false,
  })
);

loginRouter.get(
  "/microsoft/callback",
  passport.authenticate("auth-microsoft", {
    failureRedirect: "/auth/microsoft",
    session: false,
  }),
  (req, res) => {
    const user = req.user;

    const userData = {
      id: user.id,
      email: user.email,
      role: user.rol,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(userData, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Enviar cookie igual que en loginController
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true, // true solo si usas HTTPS
      sameSite: 'None',
      maxAge: 3600000, // 1 hora
    });
    const userString = JSON.stringify(userData);
    

    res.send(`<!DOCTYPE html>
    <html lang="en">
      <body>
      </body>
      <script>
        window.opener.postMessage(${userString}, 'https://uniblock-frontend.vercel.app/user')
      </script>
    </html>`);
  }
);

export { loginRouter };
