"use client";
/*
 * Documentation:
 * Default Page Layout — https://app.subframe.com/65982c8dc629/library?component=Default+Page+Layout_a57b1c43-310a-493f-b807-8cc88e2452cf
 * Sidebar Collapsible — https://app.subframe.com/65982c8dc629/library?component=Sidebar+Collapsible_e732d4fd-dae8-4053-bb88-7c02acab53f9
 * Avatar — https://app.subframe.com/65982c8dc629/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 * Dropdown Menu — https://app.subframe.com/65982c8dc629/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 */

import React from "react";
import * as SubframeUtils from "../utils";
import { SidebarCollapsible } from "../components/SidebarCollapsible";
import { FeatherHome } from "@subframe/core";
import { FeatherInbox } from "@subframe/core";
import { FeatherBarChart2 } from "@subframe/core";
import { Avatar } from "../components/Avatar";
import { FeatherChevronsUpDown } from "@subframe/core";
import { DropdownMenu } from "../components/DropdownMenu";
import { FeatherUserPlus } from "@subframe/core";
import { FeatherSettings } from "@subframe/core";
import { FeatherLogOut } from "@subframe/core";
import * as SubframeCore from "@subframe/core";

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex h-screen w-full items-start mobile:flex mobile:flex-row mobile:flex-nowrap mobile:gap-0 mobile:rounded-none mobile:border-none mobile:bg-transparent mobile:px-0 mobile:py-0 mobile:shadow-none",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <SidebarCollapsible
        header={
          <img
            className="h-6 flex-none object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
          />
        }
        footer={
          <SubframeCore.DropdownMenu.Root>
            <SubframeCore.DropdownMenu.Trigger asChild={true}>
              <div className="flex grow shrink-0 basis-0 items-center gap-4">
                <div className="flex grow shrink-0 basis-0 items-start gap-4">
                  <Avatar image="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg">
                    A
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-caption-bold font-caption-bold text-default-font">
                      Irvin
                    </span>
                    <span className="text-caption font-caption text-subtext-color">
                      Founder
                    </span>
                  </div>
                </div>
                <FeatherChevronsUpDown className="text-body font-body text-default-font" />
              </div>
            </SubframeCore.DropdownMenu.Trigger>
            <SubframeCore.DropdownMenu.Portal>
              <SubframeCore.DropdownMenu.Content
                side="top"
                align="start"
                sideOffset={8}
                asChild={true}
              >
                <DropdownMenu>
                  <DropdownMenu.DropdownItem icon={<FeatherUserPlus />}>
                    Invite team
                  </DropdownMenu.DropdownItem>
                  <DropdownMenu.DropdownItem icon={<FeatherSettings />}>
                    Settings
                  </DropdownMenu.DropdownItem>
                  <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
                  <DropdownMenu.DropdownItem icon={<FeatherLogOut />}>
                    Sign out
                  </DropdownMenu.DropdownItem>
                </DropdownMenu>
              </SubframeCore.DropdownMenu.Content>
            </SubframeCore.DropdownMenu.Portal>
          </SubframeCore.DropdownMenu.Root>
        }
      >
        <SidebarCollapsible.NavItem icon={<FeatherHome />} selected={true}>
          Home
        </SidebarCollapsible.NavItem>
        <SidebarCollapsible.NavItem icon={<FeatherInbox />}>
          Inbox
        </SidebarCollapsible.NavItem>
        <SidebarCollapsible.NavItem icon={<FeatherBarChart2 />}>
          Reports
        </SidebarCollapsible.NavItem>
      </SidebarCollapsible>
      {children ? (
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4 self-stretch overflow-y-auto bg-default-background">
          {children}
        </div>
      ) : null}
    </div>
  );
});

export const DefaultPageLayout = DefaultPageLayoutRoot;
