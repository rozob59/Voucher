import React, { useState } from 'react';
import { AIDE_PROJECT_FILES, AideFile } from '../services/aideSource';
import { Smartphone, Copy, Check, Download, BookOpen, FileCode, CheckCircle2 } from 'lucide-react';

interface AideExportViewProps {
  onCopyText: (text: string, label: string) => void;
}

export const AideExportView: React.FC<AideExportViewProps> = ({ onCopyText }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedFileIndex, setCopiedFileIndex] = useState<number | null>(null);

  const selectedFile: AideFile = AIDE_PROJECT_FILES[selectedFileIndex] || AIDE_PROJECT_FILES[0];

  const handleCopyCode = (index: number, content: string, path: string) => {
    onCopyText(content, `Copied ${path}`);
    setCopiedFileIndex(index);
    setTimeout(() => setCopiedFileIndex(null), 2000);
  };

  const handleDownloadSingleFile = (file: AideFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.split('/').pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold mb-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>AIDE Android IDE Compatibility</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              AIDE অ্যান্ড্রয়েড সোর্স কোড এবং বিল্ড গাইড (AIDE Export)
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Copy and build this Android app directly on your Android phone using AIDE IDE without any PC or website server!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="/rozob_wifi_aide_project.zip"
              download="rozob_wifi_aide_project.zip"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
            >
              <Download className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>ডাউনলোড AIDE ZIP প্রজেক্ট (Download ZIP)</span>
            </a>

            <button
              onClick={() => handleCopyCode(selectedFileIndex, selectedFile.content, selectedFile.path)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 shadow border border-slate-700"
            >
              <Copy className="w-4 h-4 text-emerald-400" />
              <span>Copy Selected File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main File Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar File List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2 shadow-lg max-h-[600px] overflow-y-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pb-2 border-b border-slate-800">
            Project File Explorer
          </p>

          {AIDE_PROJECT_FILES.map((file, idx) => {
            const isSelected = selectedFileIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedFileIndex(idx)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-500 ring-1 ring-emerald-500 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono font-bold truncate">{file.path}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{file.description}</p>
                </div>

                <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-semibold uppercase shrink-0">
                  {file.language}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Code Display Viewer */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[600px]">
          {/* Header Bar */}
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs font-mono font-bold text-emerald-400 truncate block">
                {selectedFile.path}
              </span>
              <span className="text-[10px] text-slate-400 block">{selectedFile.description}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleDownloadSingleFile(selectedFile)}
                title="Download file"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                onClick={() => handleCopyCode(selectedFileIndex, selectedFile.content, selectedFile.path)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                {copiedFileIndex === selectedFileIndex ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code Area */}
          <div className="p-4 bg-slate-950 flex-1 overflow-auto">
            <pre className="font-mono text-xs text-emerald-300/90 leading-relaxed whitespace-pre font-normal select-all">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>

      {/* AIDE Installation & Compilation Guide Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <span>AIDE দিয়ে অ্যান্ড্রয়েড ফোনে APK বিল্ড করার নির্দেশিকা (Step-by-Step Guide)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center">
              1
            </div>
            <p className="font-bold text-white text-sm">AIDE প্রজেক্ট ক্রিয়েট</p>
            <p className="text-slate-400 leading-relaxed">
              Open AIDE on Android &rarr; New Android Kotlin App &rarr; Name: ROZOB WiFi Voucher Manager &rarr; Package: com.rozob.wifivouchermanager.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center">
              2
            </div>
            <p className="font-bold text-white text-sm">কোড ফাইল পেস্ট করুন</p>
            <p className="text-slate-400 leading-relaxed">
              Copy build.gradle, AndroidManifest.xml, Room Entities (Voucher.kt), DAO, PdfGenerator.kt, and MainActivity.kt into your project folders.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center">
              3
            </div>
            <p className="font-bold text-white text-sm">APK বিল্ড এবং ইনস্টল</p>
            <p className="text-slate-400 leading-relaxed">
              Tap Build / Run in AIDE &rarr; Install APK &rarr; Test bulk voucher import &amp; offline PDF generation immediately!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
