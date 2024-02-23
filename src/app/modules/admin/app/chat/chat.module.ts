import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { ChatComponent } from './chat.component';
import { chatRoutes } from './chat.routing';
import { ChatsComponent } from './chats/chats.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { ConversationComponent } from './conversation/conversation.component';
import { EmptyConversationComponent } from './empty-conversation/empty-conversation.component';
import { MatSelectModule } from '@angular/material/select';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        ChatComponent,
        ChatsComponent,
        ContactInfoComponent,
        ConversationComponent,
        EmptyConversationComponent,
    ],
    imports     : [
        RouterModule.forChild(chatRoutes),
        FuseScrollbarModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatMenuModule,
        MatSidenavModule,
        SharedModule,
        MatTooltipModule,
    ]
})
export class ChatModule
{
}
