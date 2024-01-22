import { Route } from '@angular/router';
import { ChatComponent } from './chat.component';
import { ChatsComponent } from './chats/chats.component';
import { ConversationComponent } from './conversation/conversation.component';
import { EmptyConversationComponent } from './empty-conversation/empty-conversation.component';
import { ConversationsResolver, TicketsResolver, UsersResolver } from './chat.resolvers';

export const chatRoutes: Route[] = [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            tickets: TicketsResolver,
            users: UsersResolver,
        },
        children: [
            {
                path: '',
                component: ChatsComponent,
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: EmptyConversationComponent
                    },
                    {
                        path: ':id',
                        component: ConversationComponent,
                        resolve: {
                            conversation: ConversationsResolver
                        }
                    }
                ]
            }
        ]
    }
];
