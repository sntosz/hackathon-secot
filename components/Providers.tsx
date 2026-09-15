"use client";

import React from "react";
import { HoursProvider } from "../context/HoursContext";
import ToastContainer from "./ToastContainer";
import AddCertificateModal from "./AddCertificateModal";
import CertificateModal from "./CertificateModal";
import ShortcutsModal from "./ShortcutsModal";
import EmailShareModal from "./EmailShareModal";
import SecretaryReviewModal from "./SecretaryReviewModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HoursProvider>
      {children}
      <ToastContainer />
      <AddCertificateModal />
      <CertificateModal />
      <SecretaryReviewModal />
      <ShortcutsModal />
      <EmailShareModal />
    </HoursProvider>
  );
}
