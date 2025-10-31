import React from "react";

const AlbumCredits: React.FC = () => {
  return (
    <section className="py-16 text-center">
      <h2 className="font-playfair text-2xl md:text-3xl text-[#CBAE7A] mb-2">
        With Gratitude
      </h2>
      <p className="text-subtle mb-10">
        In quiet collaboration — where every role becomes part of the light.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 max-w-3xl mx-auto text-sm">
        {/* LEFT */}
        <div className="space-y-4">
          <div>
            <p className="uppercase tracking-wide text-[11px] text-subtle mb-1">
              Producer & Pianist
            </p>
            <p className="font-playfair text-[#CBAE7A]">Auralis</p>
          </div>

          <div>
            <p className="uppercase tracking-wide text-[11px] text-subtle mb-1">
              Music Technician
            </p>
            <p className="font-playfair text-[#CBAE7A]">Auralis</p>
          </div>

          <div>
            <p className="uppercase tracking-wide text-[11px] text-subtle mb-1">
              Label & Publisher
            </p>
            <p className="font-playfair text-[#CBAE7A]">Auralis Music</p>
          </div>

          <div>
            <p className="uppercase tracking-wide text-[11px] text-subtle mb-1">
              Created By
            </p>
            <p className="font-playfair text-[#CBAE7A]">Auralis Music</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div>
            <p className="uppercase tracking-wide text-[11px] text-subtle mb-1">
              Composer
            </p>
            <p className="font-playfair text-[#CBAE7A]">Soyoung Joung</p>
          </div>

          <div>
            <p className="uppercase tracking-wide text-[11px] text-subtle mb-1">
              Artwork & Design
            </p>
            <p className="font-playfair text-[#CBAE7A]">Auralis</p>
          </div>

          <div>
            <p className="uppercase tracking-wide text-[11px] text-subtle mb-1">
              Management & Distributor
            </p>
            <p className="font-playfair text-[#CBAE7A]">ARTRE</p>
          </div>

          <div>
            <p className="uppercase tracking-wide text-[11px] text-subtle mb-1">
              Catalogue No.
            </p>
            <p className="font-playfair text-[#CBAE7A]">ARTRE2025-009</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-40 mx-auto bg-[#CBAE7A] opacity-80 mt-16 mb-8" />

      {/* Back button */}
      <div className="text-center">
        <button className="px-6 py-2 text-sm border border-[#CBAE7A]/40 rounded-full text-subtle hover:text-[#CBAE7A] transition">
          ← Back to Albums
        </button>
      </div>
    </section>
  );
};

export default AlbumCredits;
