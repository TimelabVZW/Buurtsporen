import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express/multer';
import { AuthModule } from './auth/auth.module';
import { LayerModule } from './layer/layer.module';
import { MarkerModule } from './marker/marker.module';
import { CoordinateModule } from './coordinate/coordinate.module';
import { TimestampModule } from './timestamp/timestamp.module';
import { DateScalar } from './scalar-date/scalar-date';
import { IconModule } from './icon/icon.module';

@Module({
  imports: [
    UserModule,
    MulterModule.register({
      dest: './upload',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      introspection: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          url: process.env.DATABASE_URL,
          type: 'postgres',
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    AuthModule,
    LayerModule,
    MarkerModule,
    CoordinateModule,
    TimestampModule,
    IconModule,
  ],
  controllers: [AppController],
  providers: [AppService, DateScalar],
})
export class AppModule {}
