import React, { useState } from 'react';
import { RESTAURANT_TABLES } from '../data/floorPlanData';
import { Sparkles, Users, Eye, Volume2, CheckCircle2, Lock, Compass } from 'lucide-react';

export default function InteractiveTableMap({
  selectedTableId,
  onSelectTable,
  preferredZone
}) {
  const [activeZoneFilter, setActiveZoneFilter] = useState('All');

  // Filter tables
  const displayedTables = activeZoneFilter === 'All'
    ? RESTAURANT_TABLES
    : RESTAURANT_TABLES.filter(t =>
        t.zone.toLowerCase().includes(activeZoneFilter.toLowerCase()) ||
        t.zoneId === activeZoneFilter ||
        (activeZoneFilter === 'Golden Hour' && t.zoneId === 'grand-hall') ||
        (activeZoneFilter === 'Chef Table' && t.zoneId === 'chef-table') ||
        (activeZoneFilter === 'Saffron Salon' && t.zoneId === 'saffron-salon') ||
        (activeZoneFilter === 'Botanical Lounge' && t.zoneId === 'botanical-bar')
      );

  // Current selected table object
  const currentSelected = RESTAURANT_TABLES.find(t => t.id === selectedTableId) || RESTAURANT_TABLES[0];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Filter and Legend Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {/* Zone Selector Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', 'Golden Hour', 'Chef Table', 'Saffron Salon', 'Botanical Lounge'].map((filterName) => (
            <button
              key={filterName}
              type="button"
              onClick={() => setActiveZoneFilter(filterName)}
              className={`nav-pill-btn cursor-pointer ${
                activeZoneFilter === filterName ? '!bg-[var(--brass-500)] !text-black !font-bold' : ''
              }`}
              style={{
                padding: '0.3rem 0.75rem',
                fontSize: '0.66rem',
                background: activeZoneFilter === filterName ? 'var(--brass-500)' : 'rgba(18,15,13,0.7)',
                color: activeZoneFilter === filterName ? '#080605' : 'var(--ivory-300)',
                borderColor: activeZoneFilter === filterName ? 'var(--brass-300)' : 'var(--border-subtle)',
                fontWeight: activeZoneFilter === filterName ? 'bold' : 'normal'
              }}
            >
              {filterName}
            </button>
          ))}
        </div>

        {/* Cinema-Style Status Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.68rem', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.7)' }} />
            <span style={{ color: 'var(--ivory-200)' }}>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brass-400)', boxShadow: '0 0 8px rgba(197,155,39,0.9)' }} />
            <span style={{ color: 'var(--brass-300)', fontWeight: 'bold' }}>Your Table</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#451a1a', border: '1px solid #7f1d1d' }} />
            <span style={{ color: 'var(--ivory-muted)' }}>Booked</span>
          </div>
        </div>
      </div>

      {/* Architectural Blueprint Floor Plan Canvas */}
      <div className="table-map-blueprint">
        {/* Top Architectural Pass: Kitchen Theatre (Cinema 'Screen' Equivalent) */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '60%',
              height: '3px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, transparent, var(--brass-400), transparent)',
              boxShadow: '0 0 15px rgba(197,155,39,0.8)'
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.35rem',
              fontSize: '0.64rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--brass-300)',
              fontFamily: 'monospace'
            }}
          >
            <Sparkles className="w-3 h-3 text-[var(--brass-400)]" />
            <span>Open Fire Kitchen Pass & Copper Cauldrons</span>
            <Sparkles className="w-3 h-3 text-[var(--brass-400)]" />
          </div>
        </div>

        {/* Blueprint Layout Grid of Tables */}
        <div className="table-grid-container">
          {displayedTables.map((table) => {
            const isSelected = selectedTableId === table.id;
            const isBooked = table.status === 'booked';

            return (
              <div
                key={table.id}
                onClick={() => {
                  if (!isBooked) {
                    onSelectTable(table);
                  }
                }}
                className={`table-node-card ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
              >
                {/* Table Header: ID & Shape Dot */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.58rem',
                        fontWeight: 'bold',
                        background: isSelected ? 'var(--brass-400)' : isBooked ? '#5c2424' : '#10b981',
                        color: isSelected || !isBooked ? '#0a0807' : '#9ca3af',
                        boxShadow: isSelected ? '0 0 10px rgba(197,155,39,0.8)' : !isBooked ? '0 0 6px rgba(16,185,129,0.5)' : 'none'
                      }}
                    >
                      {table.shape === 'booth' ? 'B' : table.shape === 'counter' ? 'C' : table.seats}
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 600, color: '#faf7f2' }}>
                      {table.id}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {isBooked ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.58rem', fontFamily: 'monospace', color: '#f87171', textTransform: 'uppercase' }}>
                      <Lock className="w-2.5 h-2.5" /> Booked
                    </span>
                  ) : isSelected ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.6rem', fontFamily: 'monospace', color: 'var(--brass-300)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      <CheckCircle2 className="w-3 h-3 text-[var(--brass-400)]" /> Selected
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#34d399', textTransform: 'uppercase' }}>
                      Free
                    </span>
                  )}
                </div>

                {/* Table Title & Capacity */}
                <div style={{ margin: '0.2rem 0' }}>
                  <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#f3ede2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {table.tableNumber}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.64rem', color: 'var(--ivory-muted)' }}>
                    <Users className="w-3 h-3 text-[var(--brass-400)]" />
                    <span>{table.seats} Seats</span>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <span style={{ textTransform: 'capitalize' }}>{table.shape}</span>
                  </div>
                </div>

                {/* Table View Advantage Badge */}
                <div
                  style={{
                    marginTop: '0.4rem',
                    paddingTop: '0.35rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.62rem'
                  }}
                >
                  <span style={{ color: 'var(--brass-400)', fontFamily: 'var(--font-editorial)', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {table.view}
                  </span>
                  <span style={{ color: 'var(--ivory-muted)', whiteSpace: 'nowrap', marginLeft: '0.25rem' }}>
                    {table.atmosphere.includes('Quiet') ? '🤫 Quiet' : '🔥 Vibrant'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Architectural Boundary */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.68rem',
            color: 'var(--ivory-muted)',
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Compass className="w-3.5 h-3.5 text-[var(--brass-400)]" />
            <span>South Entrance: Candlelit Archways & Water Fountain</span>
          </div>
          <span>East Jali Screens: Courtyard Garden View</span>
        </div>
      </div>

      {/* Instant Table Preview Details Card (When a table is clicked) */}
      {currentSelected && (
        <div className="table-preview-card">
          {/* Table Photographic Snapshot */}
          <div
            style={{
              width: '130px',
              height: '84px',
              borderRadius: '8px',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid var(--border-brass)',
              position: 'relative'
            }}
          >
            <img
              src={currentSelected.image}
              alt={currentSelected.tableNumber}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)'
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '4px',
                left: '6px',
                fontSize: '0.62rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'var(--brass-300)',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}
            >
              {currentSelected.id}
            </span>
          </div>

          {/* Table Detailed Attributes */}
          <div style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#faf7f2', margin: 0 }}>
                {currentSelected.tableNumber} • {currentSelected.zone}
              </h4>
              <span
                style={{
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  background: 'rgba(197,155,39,0.15)',
                  border: '1px solid var(--brass-500)',
                  fontSize: '0.62rem',
                  fontFamily: 'monospace',
                  color: 'var(--brass-200)',
                  textTransform: 'uppercase'
                }}
              >
                {currentSelected.seats} Guests Max
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--ivory-200)', fontFamily: 'var(--font-editorial)', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
              “{currentSelected.description}”
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.2rem', fontSize: '0.66rem', fontFamily: 'monospace' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--brass-400)' }}>
                <Eye className="w-3 h-3" /> {currentSelected.view}
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--ivory-200)' }}>
                <Volume2 className="w-3 h-3 text-[var(--brass-500)]" /> {currentSelected.atmosphere}
              </span>
              {currentSelected.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--ivory-muted)',
                    fontSize: '0.62rem'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Table Confirmation Checkmark */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--brass-500)',
                color: '#0a0807',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(197,155,39,0.7)'
              }}
            >
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span style={{ fontSize: '0.62rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--brass-300)', marginTop: '0.3rem' }}>
              Table Selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
