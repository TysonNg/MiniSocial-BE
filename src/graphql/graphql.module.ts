// import { Module } from "@nestjs/common";
// import { GraphQLModule } from "@nestjs/graphql";
// import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo'
// import { join } from "path";
// import { upperDirectiveTransformer } from "src/common/directives/upper-case.directive";
// import { DirectiveLocation, GraphQLDirective } from "graphql";
// import { PostResolver } from "src/features/posts/post.resolver";
// import { PostModule } from "src/features/posts/post.module";
// import { KeyStoreModule } from "src/features/keystore/keystore.module";

// @Module({
//     imports:[
//         GraphQLModule.forRoot<ApolloDriverConfig>({
//             driver: ApolloDriver,
//             graphiql: false,
//             sortSchema: true,
//             context: ({ req } : {req :any}) => ({ req }),
//             typePaths: [join(process.cwd(), 'src/graphql/schema/schema.gql')],
//             transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
//             buildSchemaOptions:{
//                 directives:[
//                     new GraphQLDirective({
//                         name:'upper',
//                         locations: [DirectiveLocation.FIELD_DEFINITION],
//                     })
//                 ]
//             }
//         }),
//         PostModule,
//         KeyStoreModule
        
//     ],
//     providers: [PostResolver]
// })

// export class GraphqlModule{}