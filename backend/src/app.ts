import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import alimentoRoutes from './routes/alimento.routes';
import solicitudRoutes from './routes/solicitud.routes';
import categoriaRoutes from './routes/categoria.routes';
import usuarioRoutes from './routes/usuario.routes';
import dashboardRoutes from './routes/dashboard.routes';
import historialRoutes from './routes/historial.routes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/alimentos', alimentoRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/historial', historialRoutes);

export default app;