"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/fft.js/lib/fft.js
  var require_fft = __commonJS({
    "node_modules/fft.js/lib/fft.js"(exports, module) {
      "use strict";
      function FFT3(size) {
        this.size = size | 0;
        if (this.size <= 1 || (this.size & this.size - 1) !== 0)
          throw new Error("FFT size must be a power of two and bigger than 1");
        this._csize = size << 1;
        var table = new Array(this.size * 2);
        for (var i = 0; i < table.length; i += 2) {
          const angle = Math.PI * i / this.size;
          table[i] = Math.cos(angle);
          table[i + 1] = -Math.sin(angle);
        }
        this.table = table;
        var power = 0;
        for (var t = 1; this.size > t; t <<= 1)
          power++;
        this._width = power % 2 === 0 ? power - 1 : power;
        this._bitrev = new Array(1 << this._width);
        for (var j = 0; j < this._bitrev.length; j++) {
          this._bitrev[j] = 0;
          for (var shift = 0; shift < this._width; shift += 2) {
            var revShift = this._width - shift - 2;
            this._bitrev[j] |= (j >>> shift & 3) << revShift;
          }
        }
        this._out = null;
        this._data = null;
        this._inv = 0;
      }
      module.exports = FFT3;
      FFT3.prototype.fromComplexArray = function fromComplexArray(complex, storage) {
        var res = storage || new Array(complex.length >>> 1);
        for (var i = 0; i < complex.length; i += 2)
          res[i >>> 1] = complex[i];
        return res;
      };
      FFT3.prototype.createComplexArray = function createComplexArray() {
        const res = new Array(this._csize);
        for (var i = 0; i < res.length; i++)
          res[i] = 0;
        return res;
      };
      FFT3.prototype.toComplexArray = function toComplexArray(input, storage) {
        var res = storage || this.createComplexArray();
        for (var i = 0; i < res.length; i += 2) {
          res[i] = input[i >>> 1];
          res[i + 1] = 0;
        }
        return res;
      };
      FFT3.prototype.completeSpectrum = function completeSpectrum(spectrum) {
        var size = this._csize;
        var half = size >>> 1;
        for (var i = 2; i < half; i += 2) {
          spectrum[size - i] = spectrum[i];
          spectrum[size - i + 1] = -spectrum[i + 1];
        }
      };
      FFT3.prototype.transform = function transform(out, data) {
        if (out === data)
          throw new Error("Input and output buffers must be different");
        this._out = out;
        this._data = data;
        this._inv = 0;
        this._transform4();
        this._out = null;
        this._data = null;
      };
      FFT3.prototype.realTransform = function realTransform(out, data) {
        if (out === data)
          throw new Error("Input and output buffers must be different");
        this._out = out;
        this._data = data;
        this._inv = 0;
        this._realTransform4();
        this._out = null;
        this._data = null;
      };
      FFT3.prototype.inverseTransform = function inverseTransform(out, data) {
        if (out === data)
          throw new Error("Input and output buffers must be different");
        this._out = out;
        this._data = data;
        this._inv = 1;
        this._transform4();
        for (var i = 0; i < out.length; i++)
          out[i] /= this.size;
        this._out = null;
        this._data = null;
      };
      FFT3.prototype._transform4 = function _transform4() {
        var out = this._out;
        var size = this._csize;
        var width = this._width;
        var step = 1 << width;
        var len = size / step << 1;
        var outOff;
        var t;
        var bitrev = this._bitrev;
        if (len === 4) {
          for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
            const off = bitrev[t];
            this._singleTransform2(outOff, off, step);
          }
        } else {
          for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
            const off = bitrev[t];
            this._singleTransform4(outOff, off, step);
          }
        }
        var inv = this._inv ? -1 : 1;
        var table = this.table;
        for (step >>= 2; step >= 2; step >>= 2) {
          len = size / step << 1;
          var quarterLen = len >>> 2;
          for (outOff = 0; outOff < size; outOff += len) {
            var limit = outOff + quarterLen;
            for (var i = outOff, k = 0; i < limit; i += 2, k += step) {
              const A = i;
              const B = A + quarterLen;
              const C = B + quarterLen;
              const D = C + quarterLen;
              const Ar = out[A];
              const Ai = out[A + 1];
              const Br = out[B];
              const Bi = out[B + 1];
              const Cr = out[C];
              const Ci = out[C + 1];
              const Dr = out[D];
              const Di = out[D + 1];
              const MAr = Ar;
              const MAi = Ai;
              const tableBr = table[k];
              const tableBi = inv * table[k + 1];
              const MBr = Br * tableBr - Bi * tableBi;
              const MBi = Br * tableBi + Bi * tableBr;
              const tableCr = table[2 * k];
              const tableCi = inv * table[2 * k + 1];
              const MCr = Cr * tableCr - Ci * tableCi;
              const MCi = Cr * tableCi + Ci * tableCr;
              const tableDr = table[3 * k];
              const tableDi = inv * table[3 * k + 1];
              const MDr = Dr * tableDr - Di * tableDi;
              const MDi = Dr * tableDi + Di * tableDr;
              const T0r = MAr + MCr;
              const T0i = MAi + MCi;
              const T1r = MAr - MCr;
              const T1i = MAi - MCi;
              const T2r = MBr + MDr;
              const T2i = MBi + MDi;
              const T3r = inv * (MBr - MDr);
              const T3i = inv * (MBi - MDi);
              const FAr = T0r + T2r;
              const FAi = T0i + T2i;
              const FCr = T0r - T2r;
              const FCi = T0i - T2i;
              const FBr = T1r + T3i;
              const FBi = T1i - T3r;
              const FDr = T1r - T3i;
              const FDi = T1i + T3r;
              out[A] = FAr;
              out[A + 1] = FAi;
              out[B] = FBr;
              out[B + 1] = FBi;
              out[C] = FCr;
              out[C + 1] = FCi;
              out[D] = FDr;
              out[D + 1] = FDi;
            }
          }
        }
      };
      FFT3.prototype._singleTransform2 = function _singleTransform2(outOff, off, step) {
        const out = this._out;
        const data = this._data;
        const evenR = data[off];
        const evenI = data[off + 1];
        const oddR = data[off + step];
        const oddI = data[off + step + 1];
        const leftR = evenR + oddR;
        const leftI = evenI + oddI;
        const rightR = evenR - oddR;
        const rightI = evenI - oddI;
        out[outOff] = leftR;
        out[outOff + 1] = leftI;
        out[outOff + 2] = rightR;
        out[outOff + 3] = rightI;
      };
      FFT3.prototype._singleTransform4 = function _singleTransform4(outOff, off, step) {
        const out = this._out;
        const data = this._data;
        const inv = this._inv ? -1 : 1;
        const step2 = step * 2;
        const step3 = step * 3;
        const Ar = data[off];
        const Ai = data[off + 1];
        const Br = data[off + step];
        const Bi = data[off + step + 1];
        const Cr = data[off + step2];
        const Ci = data[off + step2 + 1];
        const Dr = data[off + step3];
        const Di = data[off + step3 + 1];
        const T0r = Ar + Cr;
        const T0i = Ai + Ci;
        const T1r = Ar - Cr;
        const T1i = Ai - Ci;
        const T2r = Br + Dr;
        const T2i = Bi + Di;
        const T3r = inv * (Br - Dr);
        const T3i = inv * (Bi - Di);
        const FAr = T0r + T2r;
        const FAi = T0i + T2i;
        const FBr = T1r + T3i;
        const FBi = T1i - T3r;
        const FCr = T0r - T2r;
        const FCi = T0i - T2i;
        const FDr = T1r - T3i;
        const FDi = T1i + T3r;
        out[outOff] = FAr;
        out[outOff + 1] = FAi;
        out[outOff + 2] = FBr;
        out[outOff + 3] = FBi;
        out[outOff + 4] = FCr;
        out[outOff + 5] = FCi;
        out[outOff + 6] = FDr;
        out[outOff + 7] = FDi;
      };
      FFT3.prototype._realTransform4 = function _realTransform4() {
        var out = this._out;
        var size = this._csize;
        var width = this._width;
        var step = 1 << width;
        var len = size / step << 1;
        var outOff;
        var t;
        var bitrev = this._bitrev;
        if (len === 4) {
          for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
            const off = bitrev[t];
            this._singleRealTransform2(outOff, off >>> 1, step >>> 1);
          }
        } else {
          for (outOff = 0, t = 0; outOff < size; outOff += len, t++) {
            const off = bitrev[t];
            this._singleRealTransform4(outOff, off >>> 1, step >>> 1);
          }
        }
        var inv = this._inv ? -1 : 1;
        var table = this.table;
        for (step >>= 2; step >= 2; step >>= 2) {
          len = size / step << 1;
          var halfLen = len >>> 1;
          var quarterLen = halfLen >>> 1;
          var hquarterLen = quarterLen >>> 1;
          for (outOff = 0; outOff < size; outOff += len) {
            for (var i = 0, k = 0; i <= hquarterLen; i += 2, k += step) {
              var A = outOff + i;
              var B = A + quarterLen;
              var C = B + quarterLen;
              var D = C + quarterLen;
              var Ar = out[A];
              var Ai = out[A + 1];
              var Br = out[B];
              var Bi = out[B + 1];
              var Cr = out[C];
              var Ci = out[C + 1];
              var Dr = out[D];
              var Di = out[D + 1];
              var MAr = Ar;
              var MAi = Ai;
              var tableBr = table[k];
              var tableBi = inv * table[k + 1];
              var MBr = Br * tableBr - Bi * tableBi;
              var MBi = Br * tableBi + Bi * tableBr;
              var tableCr = table[2 * k];
              var tableCi = inv * table[2 * k + 1];
              var MCr = Cr * tableCr - Ci * tableCi;
              var MCi = Cr * tableCi + Ci * tableCr;
              var tableDr = table[3 * k];
              var tableDi = inv * table[3 * k + 1];
              var MDr = Dr * tableDr - Di * tableDi;
              var MDi = Dr * tableDi + Di * tableDr;
              var T0r = MAr + MCr;
              var T0i = MAi + MCi;
              var T1r = MAr - MCr;
              var T1i = MAi - MCi;
              var T2r = MBr + MDr;
              var T2i = MBi + MDi;
              var T3r = inv * (MBr - MDr);
              var T3i = inv * (MBi - MDi);
              var FAr = T0r + T2r;
              var FAi = T0i + T2i;
              var FBr = T1r + T3i;
              var FBi = T1i - T3r;
              out[A] = FAr;
              out[A + 1] = FAi;
              out[B] = FBr;
              out[B + 1] = FBi;
              if (i === 0) {
                var FCr = T0r - T2r;
                var FCi = T0i - T2i;
                out[C] = FCr;
                out[C + 1] = FCi;
                continue;
              }
              if (i === hquarterLen)
                continue;
              var ST0r = T1r;
              var ST0i = -T1i;
              var ST1r = T0r;
              var ST1i = -T0i;
              var ST2r = -inv * T3i;
              var ST2i = -inv * T3r;
              var ST3r = -inv * T2i;
              var ST3i = -inv * T2r;
              var SFAr = ST0r + ST2r;
              var SFAi = ST0i + ST2i;
              var SFBr = ST1r + ST3i;
              var SFBi = ST1i - ST3r;
              var SA = outOff + quarterLen - i;
              var SB = outOff + halfLen - i;
              out[SA] = SFAr;
              out[SA + 1] = SFAi;
              out[SB] = SFBr;
              out[SB + 1] = SFBi;
            }
          }
        }
      };
      FFT3.prototype._singleRealTransform2 = function _singleRealTransform2(outOff, off, step) {
        const out = this._out;
        const data = this._data;
        const evenR = data[off];
        const oddR = data[off + step];
        const leftR = evenR + oddR;
        const rightR = evenR - oddR;
        out[outOff] = leftR;
        out[outOff + 1] = 0;
        out[outOff + 2] = rightR;
        out[outOff + 3] = 0;
      };
      FFT3.prototype._singleRealTransform4 = function _singleRealTransform4(outOff, off, step) {
        const out = this._out;
        const data = this._data;
        const inv = this._inv ? -1 : 1;
        const step2 = step * 2;
        const step3 = step * 3;
        const Ar = data[off];
        const Br = data[off + step];
        const Cr = data[off + step2];
        const Dr = data[off + step3];
        const T0r = Ar + Cr;
        const T1r = Ar - Cr;
        const T2r = Br + Dr;
        const T3r = inv * (Br - Dr);
        const FAr = T0r + T2r;
        const FBr = T1r;
        const FBi = -T3r;
        const FCr = T0r - T2r;
        const FDr = T1r;
        const FDi = T3r;
        out[outOff] = FAr;
        out[outOff + 1] = 0;
        out[outOff + 2] = FBr;
        out[outOff + 3] = FBi;
        out[outOff + 4] = FCr;
        out[outOff + 5] = 0;
        out[outOff + 6] = FDr;
        out[outOff + 7] = FDi;
      };
    }
  });

  // composer.ts
  var import_fft2 = __toESM(require_fft());

  // classify.ts
  var import_fft = __toESM(require_fft());
  function pow2Floor(x) {
    let p = 1;
    while (p * 2 <= x) p *= 2;
    return p;
  }
  function classifySegment(data, sr) {
    const n = data.length;
    if (n < Math.floor(sr * 0.02)) return { role: "other", pitchHz: null, isNoise: false };
    let zc = 0;
    for (let i = 1; i < n; i++) {
      if (data[i - 1] < 0 && data[i] >= 0 || data[i - 1] >= 0 && data[i] < 0) zc++;
    }
    const zcr = zc / n;
    const hop = Math.max(1, Math.floor(sr * 0.01));
    const frames = Math.max(1, Math.floor(n / hop));
    const env = new Float32Array(frames);
    for (let f = 0; f < frames; f++) {
      const st = f * hop;
      const en = Math.min(st + hop, n);
      let s = 0;
      for (let i = st; i < en; i++) s += data[i] * data[i];
      env[f] = Math.sqrt(s / Math.max(1, en - st));
    }
    let envMean = 0;
    for (let f = 0; f < frames; f++) envMean += env[f];
    envMean /= frames;
    let envVar = 0;
    for (let f = 0; f < frames; f++) envVar += (env[f] - envMean) * (env[f] - envMean);
    const envCv = envMean > 1e-6 ? Math.sqrt(envVar / frames) / envMean : 0;
    let peakEnv = 0;
    for (let f = 0; f < frames; f++) if (env[f] > peakEnv) peakEnv = env[f];
    let tailSum = 0;
    let tailN = 0;
    for (let f = Math.floor(frames * 0.6); f < frames; f++) {
      tailSum += env[f];
      tailN++;
    }
    const tailEnv = tailN ? tailSum / tailN : 0;
    const decays = peakEnv > 1e-6 && tailEnv < 0.45 * peakEnv;
    let peaks = 0;
    let minSince = env[0];
    for (let f = 1; f < frames - 1; f++) {
      if (env[f] < minSince) minSince = env[f];
      if (env[f] >= env[f - 1] && env[f] >= env[f + 1] && env[f] > minSince * 1.5 && env[f] > envMean * 0.8) {
        peaks++;
        minSince = env[f];
      }
    }
    const durationSec = n / sr;
    const modRate = peaks / Math.max(0.05, durationSec);
    let peak = 0;
    let peakIdx = 0;
    for (let i = 0; i < n; i++) {
      const a = Math.abs(data[i]);
      if (a > peak) {
        peak = a;
        peakIdx = i;
      }
    }
    const attackSec = peakIdx / sr;
    const fftSize = Math.min(2048, pow2Floor(n));
    let centroid = 0;
    let flatness = 1;
    let lowE = 0;
    let midE = 0;
    let highE = 0;
    let speechE = 0;
    let formE = 0;
    let totalE = 0;
    let harmonicCount = 0;
    let pitchHz = null;
    const voicing = nsdfVoicing(data, sr);
    if (fftSize >= 256) {
      const fft = new import_fft.default(fftSize);
      const input = new Float64Array(fftSize);
      const N = Math.min(fftSize, n);
      for (let i = 0; i < N; i++) {
        const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (fftSize - 1));
        input[i] = data[i] * w;
      }
      const out = fft.createComplexArray();
      fft.realTransform(out, input);
      const bins = fftSize / 2;
      let sumMag = 0;
      let sumFreqMag = 0;
      let logSum = 0;
      let arithSum = 0;
      let cnt = 0;
      let pk = 1;
      let pv = -1;
      const minBin = Math.max(1, Math.floor(60 * fftSize / sr));
      const maxBin = Math.min(bins - 1, Math.floor(3e3 * fftSize / sr));
      for (let k = 1; k < bins; k++) {
        const re = out[2 * k];
        const im = out[2 * k + 1];
        const m = Math.sqrt(re * re + im * im);
        const f = k * sr / fftSize;
        sumMag += m;
        sumFreqMag += f * m;
        const mm = m + 1e-9;
        logSum += Math.log(mm);
        arithSum += mm;
        cnt++;
        if (f < 150) lowE += m;
        else if (f < 4e3) midE += m;
        else highE += m;
        if (f >= 120 && f <= 4e3) speechE += m;
        if (f >= 300 && f <= 3400) formE += m;
        totalE += m;
        if (k >= minBin && k <= maxBin && m > pv) {
          pv = m;
          pk = k;
        }
      }
      centroid = sumMag > 0 ? sumFreqMag / sumMag : 0;
      const geoMean = Math.exp(logSum / Math.max(1, cnt));
      const arithMean = arithSum / Math.max(1, cnt);
      flatness = arithMean > 0 ? geoMean / arithMean : 1;
      pitchHz = pk * sr / fftSize;
      const meanMag = sumMag / Math.max(1, cnt);
      if (voicing.medianF0 > 0) {
        for (let h = 1; h <= 8; h++) {
          const b = Math.round(h * voicing.medianF0 * fftSize / sr);
          if (b < 1 || b >= bins) break;
          let mm = 0;
          for (let d = -1; d <= 1; d++) {
            const bb = b + d;
            if (bb < 1 || bb >= bins) continue;
            const re = out[2 * bb];
            const im = out[2 * bb + 1];
            const mag = Math.sqrt(re * re + im * im);
            if (mag > mm) mm = mag;
          }
          if (mm > 3 * meanMag) harmonicCount++;
        }
      }
    }
    const lowRatio = totalE > 0 ? lowE / totalE : 0;
    const midRatio = totalE > 0 ? midE / totalE : 0;
    const speechRatio = totalE > 0 ? speechE / totalE : 0;
    const formantRatio = totalE > 0 ? formE / totalE : 0;
    const steadyTone = voicing.medianF0 > 0 && voicing.f0stdSemi < 0.22 && peaks < 2;
    const isVoice = durationSec >= 0.12 && voicing.voicedFrac >= 0.33 && voicing.medianF0 >= 80 && voicing.medianF0 <= 350 && harmonicCount >= 2 && formantRatio >= 0.12 && !steadyTone;
    const transient = attackSec < 0.05 && envCv > 0.5 && decays;
    const pitchedDrone = !isVoice && !transient && durationSec > 0.25 && voicing.medianF0 > 0 && voicing.f0stdSemi < 0.35 && flatness < 0.5 && centroid < 3e3;
    const isTonal = !isVoice && (!!pitchHz && (flatness < 0.22 || flatness < 0.32 && harmonicCount >= 3) || pitchedDrone);
    const isBreath = !isVoice && !isTonal && !transient && durationSec > 0.05 && (flatness > 0.5 || flatness > 0.3 && voicing.voicedFrac < 0.25);
    const isHum = !isVoice && !isTonal && !transient && durationSec > 0.2 && envCv < 0.35 && peaks < 2 && lowRatio > 0.5;
    const isDrone = !isVoice && !isTonal && !transient && durationSec > 0.25 && voicing.voicedFrac < 0.3;
    const isHiss = !isVoice && !isTonal && !transient && centroid > 3500 && durationSec > 0.08;
    const isNoise = isBreath || isHum || isDrone || isHiss;
    let role;
    if (isVoice) role = "voice";
    else if (transient && lowRatio > 0.5 && durationSec < 0.4) role = "kick";
    else if (transient && centroid > 5e3 && zcr > 0.18 && durationSec < 0.22) role = "hat";
    else if (transient && centroid > 500 && centroid <= 5e3 && midRatio > 0.35 && durationSec < 0.3 && flatness > 0.25)
      role = "snare";
    else if (isTonal && pitchHz) role = "tonal";
    else role = "other";
    return {
      role,
      pitchHz: role === "voice" ? voicing.medianF0 || pitchHz : role === "tonal" ? pitchedDrone && voicing.medianF0 > 0 ? voicing.medianF0 : pitchHz : null,
      isNoise
    };
  }
  function nsdfVoicing(input, srIn) {
    const D = srIn >= 44e3 ? 4 : srIn >= 22e3 ? 2 : 1;
    const sr = srIn / D;
    let data;
    if (D === 1) {
      data = input;
    } else {
      const dn = Math.floor(input.length / D);
      data = new Float32Array(dn);
      for (let i = 0; i < dn; i++) {
        let s = 0;
        const o = i * D;
        for (let k = 0; k < D; k++) s += input[o + k];
        data[i] = s / D;
      }
    }
    const W = Math.min(1024, data.length);
    const hop = Math.max(1, Math.floor(sr * 0.01));
    const minLag = Math.max(2, Math.round(sr / 350));
    const maxLag = Math.min(W - 1, Math.round(sr / 80));
    if (W <= maxLag + 2) return { voicedFrac: 0, medianF0: 0, f0stdSemi: 0 };
    const avail = Math.floor((data.length - W) / hop) + 1;
    if (avail < 1) return { voicedFrac: 0, medianF0: 0, f0stdSemi: 0 };
    const nF = Math.min(40, avail);
    const stride = Math.max(1, Math.floor(avail / nF));
    const off = (f) => f * stride * hop;
    const rms = new Float32Array(nF);
    for (let f = 0; f < nF; f++) {
      const o = off(f);
      let s = 0;
      for (let i = 0; i < W; i++) {
        const v = data[o + i];
        s += v * v;
      }
      rms[f] = Math.sqrt(s / W);
    }
    const p95 = Float32Array.from(rms).sort()[Math.floor(nF * 0.95)] || 0;
    const floor = Math.max(1e-4, p95 * 0.15);
    const buf = new Float64Array(W);
    const f0s = [];
    let active = 0;
    let voiced = 0;
    for (let f = 0; f < nF; f++) {
      if (rms[f] < floor) continue;
      active++;
      const o = off(f);
      let mean = 0;
      for (let i = 0; i < W; i++) mean += data[o + i];
      mean /= W;
      for (let i = 0; i < W; i++) buf[i] = data[o + i] - mean;
      let bestLag = -1;
      let bestVal = 0;
      const nsdfAt = (tau) => {
        let acf = 0;
        let m = 0;
        const lim = W - tau;
        for (let i = 0; i < lim; i++) {
          const a = buf[i];
          const b = buf[i + tau];
          acf += a * b;
          m += a * a + b * b;
        }
        return m > 1e-12 ? 2 * acf / m : 0;
      };
      let coarseLag = -1;
      let coarseVal = -1;
      for (let tau = minLag; tau <= maxLag; tau += 2) {
        const v = nsdfAt(tau);
        if (v > coarseVal) {
          coarseVal = v;
          coarseLag = tau;
        }
      }
      if (coarseLag < 0) continue;
      const lo = Math.max(minLag, coarseLag - 3);
      const hi = Math.min(maxLag, coarseLag + 3);
      for (let tau = lo; tau <= hi; tau++) {
        const nsdf = nsdfAt(tau);
        if (nsdf > bestVal) {
          bestVal = nsdf;
          bestLag = tau;
        }
      }
      if (bestLag > 0 && bestVal >= 0.6) {
        voiced++;
        f0s.push(sr / bestLag);
      }
    }
    if (!f0s.length) return { voicedFrac: 0, medianF0: 0, f0stdSemi: 0 };
    f0s.sort((a, b) => a - b);
    const medianF0 = f0s[f0s.length >> 1];
    const cents = f0s.map((x) => 1200 * Math.log2(x / medianF0));
    let mu = 0;
    for (const v of cents) mu += v;
    mu /= cents.length;
    let vr = 0;
    for (const v of cents) vr += (v - mu) * (v - mu);
    return { voicedFrac: active ? voiced / active : 0, medianF0, f0stdSemi: Math.sqrt(vr / cents.length) / 100 };
  }

  // composer.ts
  var SCALES = {
    Major: [0, 2, 4, 5, 7, 9, 11],
    Minor: [0, 2, 3, 5, 7, 8, 10],
    Dorian: [0, 2, 3, 5, 7, 9, 10],
    Phrygian: [0, 1, 3, 5, 7, 8, 10],
    Lydian: [0, 2, 4, 6, 7, 9, 11],
    Mixolydian: [0, 2, 4, 5, 7, 9, 10],
    Locrian: [0, 1, 3, 5, 6, 8, 10],
    "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11],
    Pentatonic: [0, 2, 4, 7, 9],
    Chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  };
  var ROOT_HZ = 130.81;
  var GENRES = {
    House: { bpm: 125, structure: "dance", kick: [0, 4, 8, 12], snare: [4, 12], hatStep: 2, kickRate: 0.85, snareRate: 1, hatRate: 1.6, motif: [0, 0, 3, 5], melSteps: [0, 4, 8, 12], noteDur: 0.45, voice: 0.5, seventh: false, arp: false, padGain: 0.22 },
    Tekno: { bpm: 180, structure: "dance", kick: [0, 4, 8, 12], snare: [], hatStep: 2, kickRate: 0.7, snareRate: 1, hatRate: 2, motif: [0, 0, 0, 3], melSteps: [0, 8], noteDur: 0.3, voice: 0.35, seventh: false, arp: false, padGain: 0.15, chords: [0, 0, 6, 6], halfTime: true },
    // halfTime:true = NON dimezzare → spinge a 180 pieno (kick four-on-floor veloce)
    EDM: { bpm: 128, structure: "dance", kick: [0, 4, 8, 12], snare: [4, 12], hatStep: 2, kickRate: 0.8, snareRate: 1.1, hatRate: 1.7, motif: [0, 4, 7, 4], melSteps: [0, 2, 4, 6, 8, 10, 12, 14], noteDur: 0.22, voice: 0.45, seventh: false, arp: true, padGain: 0.24 },
    Trance: { bpm: 138, structure: "dance", kick: [0, 4, 8, 12], snare: [4, 12], hatStep: 2, kickRate: 0.8, snareRate: 1, hatRate: 1.8, motif: [0, 4, 7, 11], melSteps: [0, 2, 4, 6, 8, 10, 12, 14], noteDur: 0.2, voice: 0.45, seventh: false, arp: true, padGain: 0.24 },
    Dubstep: { bpm: 140, structure: "dance", kick: [0, 8], snare: [8], hatStep: 4, kickRate: 0.7, snareRate: 0.9, hatRate: 2, motif: [0, 1, 0, 6], melSteps: [0, 6, 8, 11], noteDur: 0.5, voice: 0.5, seventh: false, arp: false, padGain: 0.18, chords: [0, 0, 5, 5], bassSteps: [0, 1, 2, 4, 8, 9, 10, 12], halfTime: true },
    DnB: { bpm: 174, structure: "dance", kick: [0, 10], snare: [4, 12], hatStep: 2, kickRate: 0.85, snareRate: 1.15, hatRate: 1.8, motif: [0, 7, 5, 3], melSteps: [0, 4, 8, 12], noteDur: 0.3, voice: 0.4, seventh: false, arp: false, padGain: 0.2 },
    "Hip-hop": { bpm: 90, structure: "urban", kick: [0, 6, 10], snare: [4, 12], hatStep: 2, kickRate: 0.8, snareRate: 0.95, hatRate: 1.4, motif: [0, 3, 2, 0], melSteps: [0, 10], noteDur: 0.5, voice: 0.8, seventh: true, arp: false, padGain: 0.18 },
    RnB: { bpm: 85, structure: "urban", kick: [0, 6, 10], snare: [4, 12], hatStep: 2, kickRate: 0.85, snareRate: 0.9, hatRate: 1.2, motif: [0, 2, 6, 4], melSteps: [0, 6, 12], noteDur: 0.6, voice: 0.85, seventh: true, arp: false, padGain: 0.22 },
    "Lo-fi": { bpm: 82, structure: "chill", kick: [0, 10], snare: [4, 12], hatStep: 4, kickRate: 0.9, snareRate: 0.85, hatRate: 1.3, motif: [0, 6, 4, 2], melSteps: [0, 4, 10], noteDur: 0.6, voice: 0.4, seventh: true, arp: false, padGain: 0.22 },
    Pop: { bpm: 112, structure: "pop", kick: [0, 8], snare: [4, 12], hatStep: 2, kickRate: 0.9, snareRate: 1, hatRate: 1.4, motif: [0, 2, 4, 5], melSteps: [0, 4, 8, 12], noteDur: 0.4, voice: 0.75, seventh: false, arp: false, padGain: 0.22 },
    // --- generi aggiunti dai riferimenti (Marley/Doors/Queen/Miles/Norah) ---
    Reggae: { bpm: 78, structure: "pop", kick: [8], snare: [8], hatStep: 2, kickRate: 0.85, snareRate: 0.95, hatRate: 1.3, motif: [0, 2, 4, 2], melSteps: [8], noteDur: 0.25, voice: 0.65, seventh: false, arp: false, padGain: 0.05, skankSteps: [2, 6, 10, 14] },
    // one-drop + skank in levare
    Rock: { bpm: 120, structure: "pop", kick: [0, 8], snare: [4, 12], hatStep: 2, kickRate: 0.8, snareRate: 1.05, hatRate: 1.5, motif: [0, 4, 5, 4], melSteps: [0, 4, 8, 12], noteDur: 0.4, voice: 0.6, seventh: false, arp: false, padGain: 0.14, power: true },
    // backbeat + power chord
    Jazz: { bpm: 120, structure: "chill", kick: [0], snare: [4, 12], hatStep: 2, kickRate: 0.7, snareRate: 0.8, hatRate: 1.2, motif: [0, 2, 4, 6], melSteps: [0, 4, 8, 12], noteDur: 0.35, voice: 0.5, seventh: true, arp: false, padGain: 0.2, swing: 0.33 }
    // swing + settime
  };
  for (const g of ["House", "Tekno", "EDM", "Trance", "Dubstep", "DnB"]) {
    if (GENRES[g]) {
      GENRES[g].vocoder = 1;
      GENRES[g].vocoderGain = 1.3;
    }
  }
  GENRES.Pop.vocoder = 0.5;
  GENRES.Pop.vocoderGain = 0.95;
  GENRES["Hip-hop"].vocoder = 0.55;
  GENRES["Hip-hop"].vocoderGain = 1;
  GENRES.RnB.vocoder = 0.45;
  GENRES.RnB.vocoderGain = 0.9;
  GENRES["Lo-fi"].vocoder = 0.3;
  GENRES["Lo-fi"].vocoderGain = 0.8;
  GENRES.Reggae.vocoder = 0.25;
  GENRES.Reggae.vocoderGain = 0.8;
  GENRES.Pop.autotune = 0.95;
  GENRES.RnB.autotune = 0.95;
  GENRES["Lo-fi"].autotune = 0.8;
  GENRES.Reggae.autotune = 0.8;
  GENRES.Rock.autotune = 0.7;
  GENRES.Jazz.autotune = 0.65;
  GENRES["Hip-hop"].autotune = 0.9;
  GENRES.House.autotune = 0.9;
  GENRES.Trance.autotune = 0.9;
  GENRES.EDM.autotune = 0.9;
  GENRES.DnB.autotune = 0.85;
  GENRES.Dubstep.autotune = 0.85;
  GENRES.Tekno.autotune = 0.8;
  GENRES["Hip-hop"].autotuneHard = 0.85;
  GENRES.EDM.autotuneHard = 0.75;
  GENRES.Dubstep.autotuneHard = 0.75;
  GENRES.Trance.autotuneHard = 0.6;
  GENRES.Tekno.autotuneHard = 0.6;
  GENRES.House.autotuneHard = 0.55;
  GENRES.DnB.autotuneHard = 0.55;
  GENRES.Pop.autotuneHard = 0.45;
  GENRES.RnB.autotuneHard = 0.4;
  GENRES["Lo-fi"].autotuneHard = 0.3;
  GENRES.Reggae.autotuneHard = 0.25;
  GENRES.Trance.reverb = 0.24;
  GENRES.Trance.roll = 0.85;
  GENRES.EDM.reverb = 0.2;
  GENRES.EDM.roll = 0.75;
  GENRES.Tekno.reverb = 0.18;
  GENRES.Tekno.roll = 0.8;
  GENRES.House.reverb = 0.11;
  GENRES.House.thin = 0.5;
  GENRES.Dubstep.reverb = 0.12;
  GENRES.Dubstep.thin = 0.45;
  GENRES.DnB.reverb = 0.11;
  GENRES.DnB.thin = 0.4;
  GENRES.Pop.reverb = 0.07;
  GENRES.Pop.roll = 0.35;
  GENRES["Hip-hop"].thin = 0.5;
  GENRES.RnB.thin = 0.5;
  GENRES["Lo-fi"].thin = 0.55;
  GENRES.Reggae.thin = 0.5;
  GENRES.Rock.reverb = 0.22;
  GENRES.Rock.voice = 0.55;
  GENRES.Rock.thin = 0.45;
  GENRES.Jazz.thin = 0.5;
  var PROGRESSIONS = {
    dance: [0, 5, 3, 4],
    // i–vi–IV–V (epico da club)
    pop: [0, 4, 5, 3],
    // I–V–vi–IV (il giro pop più famoso)
    urban: [0, 5, 2, 6],
    // i–VI–III–VII (loop minore hip-hop/rnb)
    chill: [1, 4, 0, 5]
    // ii–V–I–vi (cadenza jazzy lo-fi)
  };
  var STRUCTURES = {
    dance: [
      { name: "intro", weight: 2, intensity: 0.3, kick: false, snare: false, hat: true, melody: true, bass: false, voice: false, lift: false },
      { name: "build", weight: 2, intensity: 0.6, kick: true, snare: false, hat: true, melody: true, bass: true, voice: false, lift: false },
      { name: "drop", weight: 4, intensity: 1, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: true },
      { name: "break", weight: 2, intensity: 0.35, kick: false, snare: false, hat: true, melody: true, bass: true, voice: true, lift: false },
      { name: "drop2", weight: 4, intensity: 1, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: true },
      { name: "outro", weight: 1, intensity: 0.3, kick: false, snare: false, hat: true, melody: true, bass: false, voice: false, lift: false }
    ],
    pop: [
      { name: "intro", weight: 1, intensity: 0.35, kick: false, snare: false, hat: true, melody: true, bass: true, voice: false, lift: false },
      { name: "strofa", weight: 3, intensity: 0.6, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: false },
      { name: "ritornello", weight: 3, intensity: 1, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: true },
      { name: "strofa2", weight: 3, intensity: 0.65, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: false },
      { name: "bridge", weight: 2, intensity: 0.4, kick: false, snare: true, hat: false, melody: true, bass: true, voice: false, lift: false },
      { name: "ritornello2", weight: 3, intensity: 1, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: true },
      { name: "outro", weight: 1, intensity: 0.3, kick: false, snare: false, hat: true, melody: true, bass: false, voice: false, lift: false }
    ],
    urban: [
      { name: "intro", weight: 1, intensity: 0.4, kick: false, snare: false, hat: true, melody: true, bass: true, voice: false, lift: false },
      { name: "verse", weight: 4, intensity: 0.6, kick: true, snare: true, hat: true, melody: false, bass: true, voice: true, lift: false },
      { name: "hook", weight: 3, intensity: 1, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: true },
      { name: "verse2", weight: 4, intensity: 0.65, kick: true, snare: true, hat: true, melody: false, bass: true, voice: true, lift: false },
      { name: "hook2", weight: 3, intensity: 1, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: true },
      { name: "outro", weight: 1, intensity: 0.3, kick: false, snare: false, hat: true, melody: true, bass: true, voice: false, lift: false }
    ],
    chill: [
      { name: "intro", weight: 1, intensity: 0.35, kick: false, snare: false, hat: true, melody: true, bass: true, voice: false, lift: false },
      { name: "A", weight: 4, intensity: 0.6, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: false },
      { name: "B", weight: 3, intensity: 0.85, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: true },
      { name: "A2", weight: 4, intensity: 0.6, kick: true, snare: true, hat: true, melody: true, bass: true, voice: true, lift: false },
      { name: "outro", weight: 1, intensity: 0.25, kick: false, snare: false, hat: false, melody: true, bass: true, voice: false, lift: false }
    ]
  };
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0;
      a = a + 1831565813 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function normalize(data, target = 0.95) {
    let peak = 0;
    for (let i = 0; i < data.length; i++) {
      const a = Math.abs(data[i]);
      if (a > peak) peak = a;
    }
    if (peak > 1e-5) {
      const g = target / peak;
      for (let i = 0; i < data.length; i++) data[i] *= g;
    }
  }
  function highpass(data, sr, fc = 40) {
    const rc = 1 / (2 * Math.PI * fc);
    const dt = 1 / sr;
    const a = rc / (rc + dt);
    let prevX = data[0];
    let prevY = data[0];
    for (let i = 1; i < data.length; i++) {
      const x = data[i];
      const y = a * (prevY + x - prevX);
      data[i] = y;
      prevX = x;
      prevY = y;
    }
  }
  function applyFades(data, sr, ms = 6) {
    const n = Math.min(data.length >> 1, Math.floor(sr * ms / 1e3));
    for (let i = 0; i < n; i++) {
      const g = i / n;
      data[i] *= g;
      data[data.length - 1 - i] *= g;
    }
  }
  function deHiss(data, sr, amount, fMinHz = 2500) {
    if (amount <= 0) return;
    const N = 512;
    const hop = N / 2;
    if (data.length < N * 3) return;
    const frames = Math.floor((data.length - N) / hop) + 1;
    const fft = new import_fft2.default(N);
    const half = N / 2;
    const win = new Float32Array(N);
    for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1));
    const inBuf = new Float64Array(N);
    const spec = fft.createComplexArray();
    const time = fft.createComplexArray();
    const kMin = Math.max(1, Math.floor(fMinHz * N / sr));
    const energies = new Float32Array(frames);
    for (let f = 0; f < frames; f++) {
      const off = f * hop;
      let e = 0;
      for (let i = 0; i < N; i += 2) e += data[off + i] * data[off + i];
      energies[f] = e;
    }
    const order = Array.from({ length: frames }, (_, i) => i).sort((a, b) => energies[a] - energies[b]);
    const nQuiet = Math.max(2, Math.floor(frames * 0.2));
    const noiseMag = new Float64Array(half + 1);
    for (let q = 0; q < nQuiet; q++) {
      const off = order[q] * hop;
      for (let i = 0; i < N; i++) inBuf[i] = data[off + i] * win[i];
      fft.realTransform(spec, inBuf);
      for (let b = 0; b <= half; b++) {
        const re = spec[2 * b], im = spec[2 * b + 1];
        noiseMag[b] += Math.sqrt(re * re + im * im);
      }
    }
    for (let b = 0; b <= half; b++) noiseMag[b] /= nQuiet;
    const floorGain = 1 - 0.65 * amount;
    const beta = 1.2 * amount;
    const out = new Float32Array(data.length);
    const norm = new Float32Array(data.length);
    const gPrev = new Float32Array(half + 1).fill(1);
    const attackN = Math.floor(sr * 0.012);
    for (let f = 0; f < frames; f++) {
      const off = f * hop;
      for (let i = 0; i < N; i++) inBuf[i] = data[off + i] * win[i];
      fft.realTransform(spec, inBuf);
      fft.completeSpectrum(spec);
      const prot = off < attackN ? 0.35 : 1;
      for (let b = 0; b <= half; b++) {
        let g = 1;
        if (b >= kMin) {
          const re = spec[2 * b], im = spec[2 * b + 1];
          const mag = Math.sqrt(re * re + im * im) + 1e-12;
          g = 1 - beta * prot * noiseMag[b] / mag;
          const fl = 1 - (1 - floorGain) * prot;
          if (g < fl) g = fl;
          if (g > 1) g = 1;
          g = 0.6 * gPrev[b] + 0.4 * g;
        }
        gPrev[b] = g;
        const bb2 = N - b;
        spec[2 * b] *= g;
        spec[2 * b + 1] *= g;
        if (bb2 < N && bb2 !== b) {
          spec[2 * bb2] *= g;
          spec[2 * bb2 + 1] *= g;
        }
      }
      fft.inverseTransform(time, spec);
      for (let i = 0; i < N; i++) {
        const oi = off + i;
        if (oi >= data.length) break;
        out[oi] += time[2 * i] * win[i];
        norm[oi] += win[i] * win[i];
      }
    }
    for (let i = 0; i < data.length; i++) if (norm[i] > 1e-6) data[i] = out[i] / norm[i];
  }
  var DENOISE_BY_ROLE = {
    kick: 0.5,
    // il "pfff" davanti alla cassa è il più fastidioso, ma transiente protetto
    snare: 0.3,
    // lo snare È rumore a banda larga: mano leggera
    hat: 0.15,
    // l'hi-hat è quasi tutto alte frequenze: quasi nulla
    tonal: 0,
    // strumenti/droni-synth: NON toccare (possono essere "rumore usato come synth")
    voice: 0.45,
    // voce più pulita e presente
    other: 0.35
  };
  function compress(data, sr, thresh = 0.3, ratio = 3, atkMs = 4, relMs = 90) {
    const a = Math.exp(-1 / (atkMs / 1e3 * sr));
    const r = Math.exp(-1 / (relMs / 1e3 * sr));
    let env = 0;
    for (let i = 0; i < data.length; i++) {
      const x = data[i] < 0 ? -data[i] : data[i];
      env = x > env ? a * env + (1 - a) * x : r * env + (1 - r) * x;
      if (env > thresh) data[i] *= (thresh + (env - thresh) / ratio) / env;
    }
  }
  function scaleFreq(semis, degree) {
    const idx = (degree % semis.length + semis.length) % semis.length;
    const oct = Math.floor(degree / semis.length);
    return ROOT_HZ * Math.pow(2, (semis[idx] + 12 * oct) / 12);
  }
  function detectOnsetSamples(data, sr) {
    const hop = Math.max(1, Math.floor(sr * 0.01));
    const frames = Math.floor(data.length / hop);
    const energy = new Float32Array(frames);
    for (let f = 0; f < frames; f++) {
      const st = f * hop;
      const en = Math.min(st + hop, data.length);
      let s = 0;
      for (let i = st; i < en; i++) s += data[i] * data[i];
      energy[f] = Math.sqrt(s / Math.max(1, en - st));
    }
    const flux = new Float32Array(frames);
    for (let f = 1; f < frames; f++) {
      const d = energy[f] - energy[f - 1];
      flux[f] = d > 0 ? d : 0;
    }
    const onsets = [];
    let last = -100;
    const win = 20;
    for (let f = 1; f < frames - 1; f++) {
      let mean = 0;
      let c = 0;
      for (let k = Math.max(0, f - win); k < Math.min(frames, f + win); k++) {
        mean += flux[k];
        c++;
      }
      mean /= Math.max(1, c);
      if (flux[f] > mean * 1.5 + 1e-4 && flux[f] >= flux[f - 1] && flux[f] >= flux[f + 1] && f - last > 8) {
        onsets.push(f * hop);
        last = f;
      }
    }
    return onsets;
  }
  function bandOf(d, sr) {
    let N = 1;
    while (N * 2 <= Math.min(2048, d.length)) N *= 2;
    if (N < 256) return "mid";
    const fft = new import_fft2.default(N);
    const inp = new Float64Array(N);
    for (let i = 0; i < N; i++) inp[i] = d[i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)));
    const out = fft.createComplexArray();
    fft.realTransform(out, inp);
    let lo = 0, mid = 0, hi = 0;
    for (let k = 1; k < N / 2; k++) {
      const re = out[2 * k], im = out[2 * k + 1];
      const m = Math.sqrt(re * re + im * im);
      const hz = k * sr / N;
      if (hz < 200) lo += m;
      else if (hz < 2e3) mid += m;
      else hi += m;
    }
    return lo >= mid && lo >= hi ? "low" : hi >= mid ? "high" : "mid";
  }
  function brightness(d, sr) {
    let N = 1;
    while (N * 2 <= Math.min(2048, d.length)) N *= 2;
    if (N < 256) return 0;
    const fft = new import_fft2.default(N);
    const inp = new Float64Array(N);
    for (let i = 0; i < N; i++) inp[i] = d[i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)));
    const out = fft.createComplexArray();
    fft.realTransform(out, inp);
    let hi = 0;
    let tot = 0;
    for (let k = 1; k < N / 2; k++) {
      const re = out[2 * k];
      const im = out[2 * k + 1];
      const m = Math.sqrt(re * re + im * im);
      tot += m;
      if (k * sr / N > 4e3) hi += m;
    }
    return tot > 0 ? hi / tot : 0;
  }
  function extractAndClassify(data, sr, outStats) {
    var _a;
    let starts = detectOnsetSamples(data, sr);
    if (starts.length < 4) {
      starts = [];
      const stepN = Math.floor(sr * 0.3);
      for (let p = 0; p + stepN < data.length; p += stepN) starts.push(p);
    }
    const MAX_ONSETS = 220;
    if (starts.length > MAX_ONSETS) {
      const step = starts.length / MAX_ONSETS;
      const reduced = [];
      for (let i = 0; i < MAX_ONSETS; i++) reduced.push(starts[Math.floor(i * step)]);
      starts = reduced;
    }
    const raws = [];
    let nClassified = 0;
    let nNoise = 0;
    for (let i = 0; i < starts.length; i++) {
      const start = starts[i];
      const next = i + 1 < starts.length ? starts[i + 1] : data.length;
      const rawLen = Math.min(Math.floor(sr * 3), next - start);
      if (rawLen < Math.floor(sr * 0.03)) continue;
      const probeLen = Math.min(rawLen, Math.floor(sr * 0.8));
      const probe = data.subarray(start, start + probeLen);
      const { role, pitchHz, isNoise } = classifySegment(probe, sr);
      nClassified++;
      if (isNoise) {
        nNoise++;
        continue;
      }
      raws.push({ start, end: start + rawLen, role, pitchHz });
    }
    const merged = [];
    for (let i = 0; i < raws.length; ) {
      const r = raws[i];
      if (r.role !== "voice") {
        merged.push(r);
        i++;
        continue;
      }
      let end = r.end;
      let j = i + 1;
      while (j < raws.length && raws[j].end - r.start < sr * 8) {
        const gap = raws[j].start - end;
        if (raws[j].role === "voice" && gap < sr * 0.35) {
          end = raws[j].end;
          j++;
          continue;
        }
        if (raws[j].role !== "voice" && gap < sr * 0.28 && raws[j].end - raws[j].start < sr * 0.3 && j + 1 < raws.length && raws[j + 1].role === "voice" && raws[j + 1].start - raws[j].end < sr * 0.28 && raws[j + 1].end - r.start < sr * 8) {
          end = raws[j + 1].end;
          j += 2;
          continue;
        }
        break;
      }
      merged.push({ start: r.start, end, role: "voice", pitchHz: r.pitchHz });
      i = j;
    }
    const segs = [];
    for (const m of merged) {
      const cap = m.role === "voice" ? 8 : m.role === "tonal" ? 3 : m.role === "other" ? 1.5 : 1.5;
      const len = Math.min(m.end - m.start, Math.floor(sr * cap));
      if (len < Math.floor(sr * 0.03)) continue;
      let slice = data.slice(m.start, m.start + len);
      let pk = 0;
      for (let k = 0; k < slice.length; k++) {
        const a = Math.abs(slice[k]);
        if (a > pk) pk = a;
      }
      if (pk > 1e-4) {
        const tThr = pk * 0.03;
        const minLen = Math.floor(sr * 0.03);
        let last = slice.length - 1;
        while (last > minLen && Math.abs(slice[last]) < tThr) last--;
        const keep = Math.min(slice.length, last + 1 + Math.floor(sr * 0.015));
        if (keep < slice.length) slice = slice.slice(0, keep);
      }
      const dn = (_a = DENOISE_BY_ROLE[m.role]) != null ? _a : 0.3;
      if (dn > 0) deHiss(slice, sr, dn);
      if (m.role === "voice") compress(slice, sr);
      normalize(slice, 0.95);
      applyFades(slice, sr);
      let e = 0;
      for (let k = 0; k < slice.length; k += 8) e += slice[k] * slice[k];
      segs.push({ data: slice, role: m.role, pitchHz: m.pitchHz, energy: e, pos: m.start, bright: brightness(slice, sr), band: bandOf(slice, sr) });
    }
    segs.sort((a, b) => b.energy - a.energy);
    if (outStats) {
      const win = Math.floor(sr * 0.05) || 1;
      const rmsArr = [];
      for (let s = 0; s + win <= data.length; s += win) {
        let e = 0;
        for (let i = 0; i < win; i++) e += data[s + i] * data[s + i];
        rmsArr.push(Math.sqrt(e / win));
      }
      rmsArr.sort((a, b) => a - b);
      const floorRms = rmsArr.length ? rmsArr[Math.floor(rmsArr.length * 0.2)] : 0;
      const sigRms = rmsArr.length ? rmsArr[Math.floor(rmsArr.length * 0.9)] : 1;
      const floorRatio = sigRms > 1e-6 ? floorRms / sigRms : 0;
      const noiseFrac = nClassified > 0 ? nNoise / nClassified : 0;
      outStats.onsets = nClassified;
      outStats.noise = nNoise;
      outStats.kept = segs.length;
      outStats.noiseFrac = noiseFrac;
      outStats.floorRatio = floorRatio;
      outStats.noisy = noiseFrac > 0.45 || floorRatio > 0.35;
    }
    return segs.slice(0, 48);
  }
  var LAYER_EQ = {
    kick: { hpf: 30, lpf: 6e3, dipHz: 400, dipDb: -3, dipQ: 1.4 },
    // unico padrone sotto i 100 Hz
    bass: { hpf: 35, lpf: 300, dipHz: 70, dipDb: -2.5, dipQ: 1.2 },
    // lascia il sub alla cassa
    snare: { hpf: 130, lpf: 12e3, dipHz: 500, dipDb: -4, dipQ: 3 },
    hat: { hpf: 500, lpf: 16e3, dipHz: 3e3, dipDb: -3, dipQ: 1.2 },
    // fuori dalla zona voce
    sparkle: { hpf: 700, lpf: 16e3, dipHz: 3e3, dipDb: -3, dipQ: 1.2 },
    pad: { hpf: 250, lpf: 6e3, dipHz: 1800, dipDb: -3.5, dipQ: 1 },
    // "tasca" per la voce
    melody: { hpf: 220, lpf: 12e3, peakHz: 1500, peakDb: 2.5 },
    voice: { hpf: 110, lpf: 12e3, dipHz: 700, dipDb: -2.5, dipQ: 1, peakHz: 3e3, peakDb: 3 },
    backing: { hpf: 200, lpf: 1e4, dipHz: 3e3, dipDb: -3.5, dipQ: 1 },
    // cede il passo al lead
    fill: { hpf: 200, lpf: 1e4, dipHz: 3e3, dipDb: -2, dipQ: 1 }
  };
  function eqForLayer(data, sr, layer) {
    var _a;
    const p = LAYER_EQ[layer];
    if (!p) return data;
    const out = Float32Array.from(data);
    hpfInplace(out, sr, p.hpf);
    lpfInplace(out, sr, p.lpf);
    if (p.dipHz && p.dipDb) peakInplace(out, sr, p.dipHz, p.dipDb, (_a = p.dipQ) != null ? _a : 1);
    if (p.peakHz && p.peakDb) peakInplace(out, sr, p.peakHz, p.peakDb, 1.2);
    return out;
  }
  function meterInfo(meter2, cfg) {
    switch (meter2) {
      case "3/4":
        return { steps: 12, kickSteps: [0, 4, 8], snareSteps: [4] };
      case "6/8":
        return { steps: 12, kickSteps: [0, 6], snareSteps: [6] };
      case "7/8":
        return { steps: 14, kickSteps: [0, 8], snareSteps: [4] };
      default:
        return { steps: 16, kickSteps: cfg.kick, snareSteps: cfg.snare };
    }
  }
  var SLOT_OF = {
    kick: "FOUNDATION",
    snare: "FOUNDATION",
    bass: "FOUNDATION",
    hat: "RHYTHM",
    sparkle: "RHYTHM",
    pad: "PAD",
    melody: "LEAD",
    voice: "LEAD",
    backing: "FILL",
    fill: "FILL"
  };
  var SLOT_PRIORITY = { FOUNDATION: 5, LEAD: 4, RHYTHM: 3, PAD: 2, FILL: 1 };
  var SLOTS = ["FOUNDATION", "RHYTHM", "PAD", "LEAD", "FILL"];
  function thinArrangement(events, durationSec, capAt) {
    if (!events.length) return events;
    const voiceWins = events.filter((e) => e.layer === "voice").map((e) => [e.when, e.when + e.dur]).sort((a, b) => a[0] - b[0]);
    const overlapsVoice = (e) => {
      const a = e.when, b = e.when + e.dur;
      for (const [vs, ve] of voiceWins) {
        if (ve <= a) continue;
        if (vs >= b) break;
        const ov = Math.min(b, ve) - Math.max(a, vs);
        if (ov > e.dur * 0.35) return true;
      }
      return false;
    };
    let kept = events.filter((e) => !(e.layer === "melody" && overlapsVoice(e)));
    const CELL = 0.01;
    const nCells = Math.max(1, Math.ceil((durationSec + 2) / CELL));
    const counts = SLOTS.map(() => new Uint16Array(nCells));
    const slotIdx = (l) => {
      var _a;
      return SLOTS.indexOf((_a = SLOT_OF[l != null ? l : "fill"]) != null ? _a : "FILL");
    };
    const order = kept.map((e, i) => ({ e, i })).sort((x, y) => {
      var _a, _b, _c, _d, _e, _f;
      const px = (_c = SLOT_PRIORITY[(_b = SLOT_OF[(_a = x.e.layer) != null ? _a : "fill"]) != null ? _b : "FILL"]) != null ? _c : 1;
      const py = (_f = SLOT_PRIORITY[(_e = SLOT_OF[(_d = y.e.layer) != null ? _d : "fill"]) != null ? _e : "FILL"]) != null ? _f : 1;
      return py - px || y.e.dur - x.e.dur || x.i - y.i;
    });
    const accepted = new Array(kept.length).fill(false);
    for (const { e, i } of order) {
      const si = slotIdx(e.layer);
      const c0 = Math.max(0, Math.floor(e.when / CELL));
      const c1 = Math.min(nCells - 1, Math.ceil((e.when + e.dur) / CELL));
      if (e.layer === "voice") {
        for (let c = c0; c <= c1; c++) counts[si][c]++;
        accepted[i] = true;
        continue;
      }
      let over = 0;
      let total = 0;
      for (let c = c0; c <= c1; c++) {
        total++;
        if (counts[si][c] > 0) continue;
        let active = 0;
        for (let k = 0; k < SLOTS.length; k++) if (counts[k][c] > 0) active++;
        if (active >= capAt(c * CELL)) over++;
      }
      if (total > 0 && over / total > 0.3) continue;
      for (let c = c0; c <= c1; c++) counts[si][c]++;
      accepted[i] = true;
    }
    return kept.filter((_, i) => accepted[i]);
  }
  function buildEvents(segs, opts, seconds, sr = 48e3) {
    var _a, _b, _c;
    const summary = { kick: 0, snare: 0, hat: 0, tonal: 0, voice: 0, other: 0 };
    for (const s of segs) summary[s.role]++;
    const pool = (r) => segs.filter((s) => s.role === r);
    const kicks = pool("kick");
    const snares = pool("snare");
    const hats = pool("hat");
    const tonals = pool("tonal");
    const voices = pool("voice");
    const others = pool("other");
    const byBright = segs.slice().sort((a, b) => b.bright - a.bright);
    const brightPool = byBright.filter((s) => s.bright > 0.25 && s.role !== "voice" && s.role !== "tonal").slice(0, 8);
    const dark = segs.slice().sort((a, b) => a.bright - b.bright);
    const byBand = (b) => segs.filter((s) => s.band === b).sort((x, y) => y.energy - x.energy);
    const lowOthers = others.filter((s) => s.band === "low");
    const highOthers = others.filter((s) => s.band === "high");
    const midOthers = others.filter((s) => s.band === "mid");
    const kickPool = kicks.length ? kicks : lowOthers.length ? lowOthers : byBand("low").length ? byBand("low") : snares.length ? snares : dark.slice(0, 3);
    const snarePool = snares.length ? snares : midOthers.length ? midOthers : byBand("mid").slice(0, 3);
    const hatPool = hats.length ? hats : highOthers.length ? highOthers : brightPool.length ? brightPool : byBand("high").slice(0, 3);
    const tonalPool = tonals.length ? tonals : voices.length ? voices : midOthers.length ? midOthers : others;
    const genreName = (_a = opts.genre) != null ? _a : "House";
    const cfg = GENRES[genreName] || GENRES.House;
    const meter2 = (_b = opts.meter) != null ? _b : "4/4";
    const { steps, kickSteps, snareSteps } = meterInfo(meter2, cfg);
    const bpm2 = Math.max(50, Math.min(200, opts.bpm || cfg.bpm));
    const sixteenth = 60 / bpm2 / 4;
    const barDur = steps * sixteenth;
    const density = bpm2 >= 140 ? 0.4 : bpm2 >= 122 ? 0.6 : 1;
    const melEvery = density >= 1 ? 1 : density >= 0.6 ? 2 : 3;
    const swingAmt = cfg.swing || 0;
    const targetSec = Math.min(60, Math.max(20, seconds));
    const totalBars = Math.max(8, Math.floor(targetSec / barDur));
    const semis = SCALES[opts.scale] || SCALES.Minor;
    const octave = semis.length;
    const scaleIdx = Object.keys(SCALES).indexOf(opts.scale);
    const gHash = hashStr(genreName);
    const rnd = mulberry32(gHash ^ scaleIdx * 2654435761 ^ steps * 97 ^ bpm2);
    const gOff = gHash % 7;
    const vSorted = voices.slice().sort((a, b) => a.pos - b.pos);
    const vSpeech = voices.filter((v) => v.pitchHz && v.pitchHz >= 75 && v.pitchHz <= 260);
    const vHookSrc = vSpeech.length ? vSpeech : voices;
    const rep = findRepeatedPhrase(vHookSrc, sr);
    const byLen = vHookSrc.slice().sort((a, b) => b.data.length - a.data.length);
    const vHook = (rep.hook ? [rep.hook, ...byLen.filter((s) => s !== rep.hook)] : byLen).slice(0, Math.min(4, vHookSrc.length));
    const vocCache = /* @__PURE__ */ new Map();
    const vocodeSeg = (src, root, capSec, nNotes) => {
      const bucket = Math.ceil(capSec * 2) / 2;
      const key = `${src.pos}_${src.data.length}_${root}_${nNotes}_${bucket}`;
      const hit = vocCache.get(key);
      if (hit) return hit;
      const degs = [0, 2, 4, 6, 8].slice(0, Math.max(3, Math.min(5, nNotes)));
      const chordHz = degs.map((d) => scaleFreq(semis, root + d));
      const capS = Math.min(src.data.length, Math.floor((capSec + 0.15) * sr));
      const srcData = src.data.length > capS ? src.data.subarray(0, capS) : src.data;
      const data = vocode(srcData, sr, chordHz);
      const seg = { data, role: "voice", pitchHz: chordHz[0], energy: src.energy, pos: src.pos, bright: src.bright, band: src.band };
      vocCache.set(key, seg);
      return seg;
    };
    const tuneCache = /* @__PURE__ */ new Map();
    const tuneSeg = (src, root, hard) => {
      if (!src.pitchHz || src.pitchHz < 60) return src;
      const key = `t_${src.pos}_${src.data.length}_${root}_${hard ? "H" : "S"}`;
      const hit = tuneCache.get(key);
      if (hit) return hit;
      const cand = [0, 2, 4].map((d) => scaleFreq(semis, root + d));
      let data;
      let newPitch = src.pitchHz;
      if (hard) {
        data = autotuneHard(src.data, sr, cand);
      } else {
        const oct = Math.round(Math.log2(src.pitchHz / cand[0]));
        const target = cand.map((f) => f * Math.pow(2, oct));
        let best = target[0];
        let bestD = 1e9;
        for (const t of target) {
          const d = Math.abs(12 * Math.log2(t / src.pitchHz));
          if (d < bestD) {
            bestD = d;
            best = t;
          }
        }
        data = autotune(src.data, sr, src.pitchHz, best);
        newPitch = best;
      }
      const seg = { ...src, data, pitchHz: newPitch };
      tuneCache.set(key, seg);
      return seg;
    };
    const prog = cfg.chords || PROGRESSIONS[cfg.structure] || PROGRESSIONS.pop;
    const baseTone = cfg.seventh ? [0, 2, 4, 6] : [0, 2, 4];
    const extLen = baseTone.length * 2;
    const chordDegrees = (root) => {
      const out = [];
      for (let o = 0; o < 2; o++) for (const t of baseTone) out.push(root + t + o * octave);
      return out;
    };
    const hookLen = 8;
    const hookContour = [];
    {
      let idx = 0;
      for (let i = 0; i < hookLen; i++) {
        hookContour.push(idx);
        const step = (rnd() < 0.35 ? 2 : 1) * (rnd() < 0.5 ? 1 : -1);
        idx = Math.max(0, Math.min(extLen - 1, idx + step));
      }
    }
    const verseContour = [0, 1, 0, 2];
    const pickTonalFor = (targetHz, k, holdSec = 0) => {
      if (!tonalPool.length) return null;
      let best = null;
      let bestRate = 1;
      let bestCost = 1e9;
      const tries = Math.min(8, tonalPool.length);
      for (let j = 0; j < tries; j++) {
        const seg = tonalPool[(gOff + k + j) % tonalPool.length];
        const rate = seg.pitchHz && seg.pitchHz > 20 ? targetHz / seg.pitchHz : 1;
        let cost = Math.abs(Math.log2(rate)) + (seg.pitchHz ? 0 : 0.6);
        if (holdSec > 0) {
          const grainSec = seg.data.length / sr / Math.max(0.25, rate);
          const reps = holdSec / Math.max(0.02, grainSec);
          if (reps > 1) cost += Math.min(1.2, (reps - 1) * 0.22);
        }
        if (cost < bestCost) {
          bestCost = cost;
          best = seg;
          bestRate = rate;
        }
      }
      return best ? { seg: best, rate: bestRate } : null;
    };
    const structure = STRUCTURES[cfg.structure];
    const totalW = structure.reduce((s, x) => s + x.weight, 0);
    const sectionBars = structure.map((x) => Math.max(1, Math.round(x.weight / totalW * totalBars)));
    let sumBars = sectionBars.reduce((a, b) => a + b, 0);
    while (sumBars * barDur > 60 && sumBars > structure.length) {
      let maxI = 0;
      for (let i = 1; i < sectionBars.length; i++) if (sectionBars[i] > sectionBars[maxI]) maxI = i;
      if (sectionBars[maxI] <= 1) break;
      sectionBars[maxI]--;
      sumBars--;
    }
    const events = [];
    const eqCache = /* @__PURE__ */ new Map();
    const forLayer = (seg, layer) => {
      const key = `${seg.pos}_${seg.data.length}_${layer}`;
      const hit = eqCache.get(key);
      if (hit) return hit;
      const out = { ...seg, data: eqForLayer(seg.data, sr, layer) };
      eqCache.set(key, out);
      return out;
    };
    const push = (seg, when, rate, gain, dur, sustain = false, pan, layer) => {
      var _a2;
      if (!seg) return;
      const p = pan !== void 0 ? pan : (_a2 = PAN_BY_ROLE[seg.role]) != null ? _a2 : 0;
      const L = layer != null ? layer : seg.role === "voice" ? "voice" : seg.role === "tonal" ? "melody" : seg.role;
      const s = LAYER_EQ[L] ? forLayer(seg, L) : seg;
      events.push({ seg: s, when, rate: Math.max(0.25, Math.min(4, rate)), gain, dur, sustain, pan: p * stereoAmt, layer: L });
    };
    const pick = (arr, i) => arr.length ? arr[(i + gOff) % arr.length] : void 0;
    const charPool = segs.filter((s) => s.data.length / sr >= 0.3 && (s.role === "other" || s.role === "voice" || s.role === "tonal")).sort((a, b) => b.energy * b.data.length - a.energy * a.data.length).slice(0, 6);
    const charFx = /* @__PURE__ */ new Map();
    const withDelay = (src, delaySec) => {
      const key = `d_${src.pos}_${delaySec.toFixed(3)}`;
      const hit = charFx.get(key);
      if (hit) return hit;
      const seg = { ...src, data: delayEffect(src.data, sr, delaySec) };
      charFx.set(key, seg);
      return seg;
    };
    const stereoAmt = ((genre2) => {
      var _a2;
      const w = genre2 && ((_a2 = STEREO[genre2]) == null ? void 0 : _a2.width) || STEREO_DEFAULT.width;
      return Math.max(0.5, Math.min(1.4, w));
    })(genreName);
    const hatOffset = Math.floor(cfg.hatStep / 2);
    let bar = 0;
    let vhIdx = 0;
    let voiceDebt = 0;
    const prevPadHz = [0, 0, 0];
    const sectionCaps = [];
    let lastLeadEnd = -1;
    for (let si = 0; si < structure.length; si++) {
      const S = structure[si];
      const nBars = sectionBars[si];
      const vol = 0.55 + 0.45 * S.intensity;
      const lift = S.lift ? octave : 0;
      const isChorus = S.lift;
      if (isChorus) vhIdx = 0;
      sectionCaps.push({
        from: bar * barDur,
        to: (bar + nBars) * barDur,
        cap: S.intensity <= 0.45 ? 2 : isChorus ? 4 : 3
      });
      for (let b = 0; b < nBars; b++, bar++) {
        const barStart = bar * barDur;
        const isSectionEnd = b === nBars - 1;
        const chordRoot = prog[b % prog.length];
        const tones = chordDegrees(chordRoot);
        const rollBar = !!cfg.roll && rnd() < 0.18 + 0.35 * cfg.roll * S.intensity;
        const fourOnFloor = [0, 4, 8, 12];
        const isClub = ["House", "Tekno", "EDM", "Trance"].includes(genreName);
        const introLike = S.intensity <= 0.45;
        const barKick = introLike ? [0, 8] : isChorus && isClub ? fourOnFloor : kickSteps;
        const barHatOffbeat = introLike ? [4, 12] : null;
        for (let s = 0; s < steps; s++) {
          const when = barStart + s * sixteenth;
          if (S.kick && barKick.includes(s)) push(pick(kickPool, bar), when, cfg.kickRate, 0.95 * vol, 0.3, false, void 0, "kick");
          if (S.snare && snareSteps.includes(s)) push(pick(snarePool, bar + s), when, cfg.snareRate, 0.55 * vol, 0.25, false, void 0, "snare");
          if (barHatOffbeat) {
            if (barHatOffbeat.includes(s) && hatPool.length) {
              push(pick(hatPool, bar + s), when, cfg.hatRate * 1.1, 0.5 * vol, 0.12, false, s % 8 === 4 ? 0.3 : -0.28, "hat");
            }
          } else if (S.hat && cfg.hatStep > 0 && s % cfg.hatStep === hatOffset) {
            const swing = (rnd() < 0.12 ? sixteenth * 0.12 : 0) + (swingAmt > 0 && s % 4 === 2 ? swingAmt * sixteenth : 0);
            const hp = s / cfg.hatStep % 2 === 0 ? 0.32 : -0.28;
            push(pick(hatPool, bar * 2 + s), when + swing, cfg.hatRate * 1.1, 0.42 * vol, 0.1, false, hp, "hat");
          }
          if (S.hat && brightPool.length) {
            const roll = cfg.roll || 0;
            if (roll > 0) {
              if (rollBar && s >= steps - 4 && rnd() < 0.55 + 0.4 * roll * S.intensity) {
                const rate = 1.2 + 0.4 * (s % 4);
                const sp = s % 2 === 0 ? 0.85 : -0.8;
                push(brightPool[(bar * 3 + s) % brightPool.length], when, rate, 0.2 * vol, sixteenth * 0.95, false, sp, "sparkle");
              }
            } else if (s % 8 === 4 && !(cfg.thin && rnd() < cfg.thin)) {
              const sp = bar % 2 === 0 ? 0.7 : -0.65;
              push(brightPool[(bar + Math.floor(s / 8)) % brightPool.length], when, 1.5, 0.3 * vol, 0.2, false, sp, "sparkle");
            }
          }
        }
        if (isSectionEnd && (S.snare || S.kick)) {
          for (let f = 0; f < 4; f++) {
            push(pick(snarePool, f), barStart + (steps - 4 + f) * sixteenth, cfg.snareRate * (1 + f * 0.12), 0.4 * vol, 0.12, false, void 0, "fill");
          }
        }
        if (S.bass && tonalPool.length && cfg.padGain > 0) {
          const triad = cfg.power || density < 1 ? [tones[0], tones[2]] : [tones[0], tones[1], tones[2]];
          const padG = cfg.padGain * (0.6 + 0.4 * density);
          const padDur = barDur * 1.02;
          const padHz = [];
          for (let c = 0; c < triad.length; c++) {
            let hz = scaleFreq(semis, triad[c]);
            const prev = prevPadHz[c];
            if (prev > 0) {
              const oct = Math.round(Math.log2(prev / hz));
              hz = hz * Math.pow(2, oct);
            }
            padHz.push(hz);
          }
          for (let c = 1; c < padHz.length; c++) {
            if (padHz[c] < 150 && Math.abs(12 * Math.log2(padHz[c] / padHz[c - 1])) < 4) padHz[c] *= 2;
          }
          for (let c = 0; c < triad.length; c++) {
            const t = pickTonalFor(padHz[c], bar * 5 + c, padDur);
            const padPan = c === 0 ? 0 : c === 1 ? -0.4 : 0.4;
            if (t) push(t.seg, barStart + c * 0.25 * sixteenth, t.rate, padG * vol * (c === 0 ? 1 : 0.8), padDur, true, padPan, "pad");
            prevPadHz[c] = padHz[c];
          }
        }
        if (S.bass && tonalPool.length) {
          if (cfg.bassSteps) {
            for (let bi = 0; bi < cfg.bassSteps.length; bi++) {
              const st = cfg.bassSteps[bi];
              if (st >= steps) continue;
              const t = pickTonalFor(scaleFreq(semis, chordRoot) / 2, bar * 8 + bi);
              if (t) push(t.seg, barStart + st * sixteenth, t.rate, (st % 4 === 0 ? 0.5 : 0.38) * vol, sixteenth * 1.6, false, 0, "bass");
            }
          } else {
            const t = pickTonalFor(scaleFreq(semis, chordRoot) / 2, bar, Math.min(barDur * 0.5, 0.6));
            if (t) push(t.seg, barStart, t.rate, 0.45 * vol, Math.min(barDur * 0.5, 0.6), true, 0, "bass");
            if (steps >= 16) {
              const t2 = pickTonalFor(scaleFreq(semis, chordRoot) / 2, bar + 7, Math.min(barDur * 0.5, 0.5));
              if (t2) push(t2.seg, barStart + 8 * sixteenth, t2.rate, 0.26 * vol, Math.min(barDur * 0.5, 0.5), true, 0, "bass");
            }
          }
        }
        if (S.melody && tonalPool.length) {
          if (isChorus) {
            for (let m = 0; m < cfg.melSteps.length; m++) {
              const st = cfg.melSteps[m];
              if (st >= steps) continue;
              if (m % melEvery !== 0) continue;
              const ci = hookContour[m % hookLen];
              const degree = tones[ci % tones.length] + lift + octave;
              const t = pickTonalFor(scaleFreq(semis, degree), bar * 31 + m, cfg.noteDur * 1.8);
              if (t) push(t.seg, barStart + st * sixteenth, t.rate, 0.42 * vol, cfg.noteDur * 1.8, true, m % 2 === 0 ? -0.22 : 0.18, "melody");
            }
          } else {
            const nNotes = Math.max(1, Math.ceil(cfg.melSteps.length / 2 * density));
            for (let m = 0; m < nNotes; m++) {
              const st = cfg.melSteps[Math.min(m * 2, cfg.melSteps.length - 1)];
              if (st >= steps) continue;
              const ci = verseContour[(b + m) % verseContour.length];
              const degree = tones[ci % tones.length] + octave;
              const t = pickTonalFor(scaleFreq(semis, degree), bar * 17 + m, cfg.noteDur * 2);
              if (t) push(t.seg, barStart + st * sixteenth, t.rate, 0.34 * vol, cfg.noteDur * 2, true, m % 2 === 0 ? -0.18 : 0.2, "melody");
            }
          }
        }
        if (cfg.skankSteps && S.melody && tonalPool.length) {
          for (const st of cfg.skankSteps) {
            if (st >= steps) continue;
            for (const deg of [tones[1] + octave, tones[2] + octave]) {
              const t = pickTonalFor(scaleFreq(semis, deg), bar * 13 + st + deg);
              if (t) push(t.seg, barStart + st * sixteenth, t.rate, 0.32 * vol, sixteenth * 1.2, false, deg % 2 === 0 ? -0.45 : 0.4, "fill");
            }
          }
        }
        if (S.voice && vSorted.length) {
          const vocal = cfg.voice >= 0.7;
          const vMax = vocal ? 6 : 5;
          const hookMax = 7;
          const vGap = 1.1 + 3 * (1 - Math.max(0, Math.min(1, cfg.voice)));
          voiceDebt += barDur / vGap;
          const nInBar = Math.floor(voiceDebt);
          voiceDebt -= nInBar;
          const slot = nInBar > 0 ? barDur / nInBar : barDur;
          for (let vi = 0; vi < nInBar; vi++) {
            const vwhen = barStart + vi * slot;
            if (vwhen < lastLeadEnd - 0.05) continue;
            const isHook = isChorus && vHook.length > 0;
            const rawVseg = isHook ? vHook[vhIdx % vHook.length] : vSorted[(vhIdx + si) % vSorted.length];
            vhIdx++;
            const segLenSec = rawVseg.data.length / sr;
            const vdur = isHook ? Math.min(hookMax, segLenSec) : Math.min(vMax, slot * 0.92, segLenSec);
            const doVoc = cfg.vocoder ? cfg.vocoder >= 1 ? true : rnd() < cfg.vocoder : false;
            const vocNotes = cfg.vocoder && cfg.vocoder >= 1 ? S.intensity >= 0.9 ? 5 : S.intensity >= 0.6 ? 4 : 3 : 3;
            const doTune = !doVoc && !!cfg.autotune && rnd() < cfg.autotune;
            const hardTune = doTune && !!cfg.autotuneHard && rnd() < cfg.autotuneHard;
            const vseg = doVoc ? vocodeSeg(rawVseg, chordRoot, vdur, vocNotes) : doTune ? tuneSeg(rawVseg, chordRoot, hardTune) : rawVseg;
            const vGainMul = doVoc ? (_c = cfg.vocoderGain) != null ? _c : 1 : 1;
            push(vseg, vwhen, 1, (0.78 + 0.18 * cfg.voice) * vol * vGainMul, vdur, false, void 0, "voice");
            lastLeadEnd = vwhen + vdur;
          }
          if (vocal && isChorus && vSorted.length) {
            const chop = vSorted[(bar * 3 + 1) % vSorted.length];
            push(chop, barStart + Math.floor(steps / 2) * sixteenth, 0.5, 0.22 * vol, 0.3, false, -0.8, "backing");
            const harm = vSorted[(bar * 5 + 2) % vSorted.length];
            push(harm, barStart + Math.floor(steps * 0.75) * sixteenth, 1.5, 0.16 * vol, 0.3, false, 0.8, "backing");
          }
        }
        if (charPool.length && bar % 4 === 3 && S.intensity >= 0.5) {
          const ci = Math.floor(bar / 4);
          const src = charPool[ci % charPool.length];
          const variantCount = cfg.vocoder ? 3 : 2;
          const variant = ci % variantCount;
          let cseg = src;
          let cpan = ci % 2 === 0 ? -0.3 : 0.3;
          if (variant === 1) {
            cseg = withDelay(src, sixteenth * 2);
          } else if (variant === 2) {
            cseg = vocodeSeg(src, chordRoot, src.data.length / sr, 3);
            cpan = 0;
          }
          const cdur = Math.min(cseg.data.length / sr, barDur * 1.6);
          push(cseg, barStart + Math.floor(steps * 0.5) * sixteenth, 1, 0.7 * vol, cdur, false, cpan, "fill");
        }
      }
    }
    const durationSec = bar * barDur;
    const capAt = (t) => {
      for (const s of sectionCaps) if (t >= s.from && t < s.to) return s.cap;
      return 3;
    };
    const thinned = thinArrangement(events, durationSec, capAt);
    return { events: thinned, durationSec, summary };
  }
  function biquadInplace(x, b0, b1, b2, a0, a1, a2) {
    const B0 = b0 / a0, B1 = b1 / a0, B2 = b2 / a0, A1 = a1 / a0, A2 = a2 / a0;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < x.length; i++) {
      const xn = x[i];
      const yn = B0 * xn + B1 * x1 + B2 * x2 - A1 * y1 - A2 * y2;
      x2 = x1;
      x1 = xn;
      y2 = y1;
      y1 = yn;
      x[i] = yn;
    }
  }
  function hpfInplace(x, sr, fc, Q = 0.707) {
    const w0 = 2 * Math.PI * fc / sr, cs = Math.cos(w0), sn = Math.sin(w0), al = sn / (2 * Q);
    biquadInplace(x, (1 + cs) / 2, -(1 + cs), (1 + cs) / 2, 1 + al, -2 * cs, 1 - al);
  }
  function shelfInplace(x, sr, fc, dB, high, Q = 0.707) {
    if (!dB) return;
    const A = Math.pow(10, dB / 40), w0 = 2 * Math.PI * fc / sr, cs = Math.cos(w0), sn = Math.sin(w0), al = sn / (2 * Q), s = 2 * Math.sqrt(A) * al;
    if (high) biquadInplace(x, A * (A + 1 + (A - 1) * cs + s), -2 * A * (A - 1 + (A + 1) * cs), A * (A + 1 + (A - 1) * cs - s), A + 1 - (A - 1) * cs + s, 2 * (A - 1 - (A + 1) * cs), A + 1 - (A - 1) * cs - s);
    else biquadInplace(x, A * (A + 1 - (A - 1) * cs + s), 2 * A * (A - 1 - (A + 1) * cs), A * (A + 1 - (A - 1) * cs - s), A + 1 + (A - 1) * cs + s, -2 * (A - 1 + (A + 1) * cs), A + 1 + (A - 1) * cs - s);
  }
  function lpfInplace(x, sr, fc, Q = 0.707) {
    if (fc >= sr * 0.48) return;
    const w0 = 2 * Math.PI * fc / sr, cs = Math.cos(w0), sn = Math.sin(w0), al = sn / (2 * Q);
    biquadInplace(x, (1 - cs) / 2, 1 - cs, (1 - cs) / 2, 1 + al, -2 * cs, 1 - al);
  }
  function peakInplace(x, sr, fc, dB, Q = 1) {
    if (!dB) return;
    const A = Math.pow(10, dB / 40), w0 = 2 * Math.PI * fc / sr, cs = Math.cos(w0), sn = Math.sin(w0), al = sn / (2 * Q);
    biquadInplace(x, 1 + al * A, -2 * cs, 1 - al * A, 1 + al / A, -2 * cs, 1 - al / A);
  }
  function bpfInplace(x, sr, fc, Q) {
    const w0 = 2 * Math.PI * fc / sr, cs = Math.cos(w0), sn = Math.sin(w0), al = sn / (2 * Q);
    biquadInplace(x, al, 0, -al, 1 + al, -2 * cs, 1 - al);
  }
  function vocode(voice, sr, chordHz, bands = 12) {
    const n0 = voice.length;
    if (n0 < 64) return Float32Array.from(voice);
    const D = sr >= 44e3 ? 3 : sr >= 3e4 ? 2 : 1;
    const dsr = sr / D;
    const n = Math.floor(n0 / D);
    const v = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const o = i * D;
      for (let k = 0; k < D; k++) s += voice[o + k];
      v[i] = s / D;
    }
    const carrier = new Float32Array(n);
    for (const f of chordHz) {
      if (!(f > 20)) continue;
      const inc = f / dsr;
      let ph = 0;
      for (let i = 0; i < n; i++) {
        carrier[i] += 2 * ph - 1;
        ph += inc;
        if (ph >= 1) ph -= 1;
      }
    }
    const fLo = 150, fHi = Math.min(7e3, dsr * 0.45);
    const relA = Math.exp(-1 / (0.01 * dsr));
    const out = new Float32Array(n);
    const vb = new Float32Array(n);
    const cb = new Float32Array(n);
    for (let b = 0; b < bands; b++) {
      const f0 = fLo * Math.pow(fHi / fLo, b / bands);
      const f1 = fLo * Math.pow(fHi / fLo, (b + 1) / bands);
      const fc = Math.min(Math.sqrt(f0 * f1), dsr * 0.45);
      const Q = Math.max(1.5, fc / Math.max(1, f1 - f0));
      vb.set(v);
      bpfInplace(vb, dsr, fc, Q);
      cb.set(carrier);
      bpfInplace(cb, dsr, fc, Q);
      let env = 0;
      for (let i = 0; i < n; i++) {
        const a = vb[i] < 0 ? -vb[i] : vb[i];
        env = a > env ? a : relA * env + (1 - relA) * a;
        out[i] += cb[i] * env;
      }
    }
    let pk = 0;
    for (let i = 0; i < n; i++) {
      const a = out[i] < 0 ? -out[i] : out[i];
      if (a > pk) pk = a;
    }
    if (pk > 1e-6) {
      const g = 0.9 / pk;
      for (let i = 0; i < n; i++) out[i] *= g;
    }
    if (D === 1) return out;
    const res = new Float32Array(n0);
    for (let i = 0; i < n0; i++) {
      const p = i / D;
      const j = Math.floor(p);
      const fr = p - j;
      res[i] = j + 1 < n ? out[j] * (1 - fr) + out[j + 1] * fr : out[n - 1];
    }
    return res;
  }
  function timeStretch(x, factor) {
    const n = x.length;
    const W = 1024;
    const Ha = W >> 2;
    const search = 220;
    const outLen = Math.max(W + 1, Math.floor(n * factor));
    const out = new Float32Array(outLen);
    const norm = new Float32Array(outLen);
    const win = new Float32Array(W);
    for (let i = 0; i < W; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (W - 1));
    let inPos = 0;
    let prevEnd = 0;
    for (let k = 0; ; k++) {
      const outStart = k * Ha;
      if (outStart + W >= outLen) break;
      let best = Math.round(inPos);
      if (k > 0 && prevEnd + Ha < n) {
        const base = Math.round(inPos);
        const corr = (c) => {
          if (c < 0 || c + W >= n) return -Infinity;
          let s = 0;
          for (let i = 0; i < Ha; i += 4) s += x[c + i] * x[prevEnd + i];
          return s;
        };
        let bestScore = -Infinity;
        for (let d = -search; d <= search; d += 8) {
          const v = corr(base + d);
          if (v > bestScore) {
            bestScore = v;
            best = base + d;
          }
        }
        const c0 = best;
        for (let d = -7; d <= 7; d++) {
          const v = corr(c0 + d);
          if (v > bestScore) {
            bestScore = v;
            best = c0 + d;
          }
        }
      }
      if (best < 0 || best + W >= n) break;
      for (let i = 0; i < W; i++) {
        out[outStart + i] += x[best + i] * win[i];
        norm[outStart + i] += win[i];
      }
      prevEnd = best + Ha;
      inPos += Ha / factor;
      if (inPos + W >= n) break;
    }
    for (let i = 0; i < outLen; i++) if (norm[i] > 1e-6) out[i] /= norm[i];
    return out;
  }
  function pitchShift(data, sr, semitones) {
    if (!semitones || data.length < 2048) return Float32Array.from(data);
    const r = Math.pow(2, semitones / 12);
    const stretched = timeStretch(data, r);
    const n = data.length;
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const sp = i * r;
      const si = Math.floor(sp);
      if (si + 1 >= stretched.length) break;
      const fr = sp - si;
      out[i] = stretched[si] * (1 - fr) + stretched[si + 1] * fr;
    }
    return out;
  }
  function autotune(data, sr, fromHz, toHz) {
    if (!(fromHz > 40) || !(toHz > 40)) return Float32Array.from(data);
    let semi = 12 * Math.log2(toHz / fromHz);
    while (semi > 6) semi -= 12;
    while (semi < -6) semi += 12;
    if (Math.abs(semi) < 0.15) return Float32Array.from(data);
    return pitchShift(data, sr, semi);
  }
  function autotuneHard(data, sr, targetsHz, blockSec = 0.18) {
    if (data.length < 4096 || !targetsHz.length) return Float32Array.from(data);
    const B = Math.max(2048, Math.floor(blockSec * sr));
    const out = new Float32Array(data.length);
    const xf = Math.floor(sr * 8e-3);
    for (let s = 0; s < data.length; s += B) {
      const end = Math.min(data.length, s + B);
      const len = end - s;
      if (len < 1024) {
        for (let i = s; i < end; i++) out[i] = data[i];
        break;
      }
      const block = data.subarray(s, end);
      const f0 = blockF0(block, sr);
      let shifted;
      if (f0 > 60) {
        let best = targetsHz[0];
        let bestD = 1e9;
        for (const t0 of targetsHz) {
          const oct = Math.round(Math.log2(f0 / t0));
          const cand = t0 * Math.pow(2, oct);
          const d = Math.abs(12 * Math.log2(cand / f0));
          if (d < bestD) {
            bestD = d;
            best = cand;
          }
        }
        const semi = 12 * Math.log2(best / f0);
        shifted = Math.abs(semi) < 0.1 || Math.abs(semi) > 7 ? Float32Array.from(block) : pitchShift(block, sr, semi);
      } else {
        shifted = Float32Array.from(block);
      }
      for (let i = 0; i < len; i++) {
        let g = 1;
        if (s > 0 && i < xf) g = i / xf;
        out[s + i] += shifted[i] * g;
        if (s > 0 && i < xf) out[s + i] += out[s + i] * 0;
      }
    }
    return out;
  }
  function blockF0(x, sr) {
    const W = Math.min(2048, x.length);
    const buf = new Float64Array(W);
    let mean = 0;
    for (let i = 0; i < W; i++) mean += x[i];
    mean /= W;
    for (let i = 0; i < W; i++) buf[i] = x[i] - mean;
    const minL = Math.max(2, Math.round(sr / 400));
    const maxL = Math.min(W - 2, Math.round(sr / 70));
    const vals = [];
    for (let tau = minL; tau <= maxL; tau += 2) {
      let acf = 0, m = 0;
      const lim = W - tau;
      for (let i = 0; i < lim; i += 2) {
        const a = buf[i], b = buf[i + tau];
        acf += a * b;
        m += a * a + b * b;
      }
      vals.push(m > 1e-12 ? 2 * acf / m : 0);
    }
    let mx = 0;
    for (const v of vals) if (v > mx) mx = v;
    if (mx < 0.45) return 0;
    for (let i = 1; i < vals.length - 1; i++) {
      if (vals[i] >= vals[i - 1] && vals[i] >= vals[i + 1] && vals[i] >= 0.85 * mx) {
        return sr / (minL + i * 2);
      }
    }
    return 0;
  }
  function delayEffect(data, sr, delaySec, feedback = 0.42, mix = 0.5, taps = 4) {
    const d = Math.max(1, Math.floor(delaySec * sr));
    const out = new Float32Array(data.length + d * taps);
    for (let i = 0; i < data.length; i++) out[i] = data[i];
    let g = feedback;
    for (let t = 1; t <= taps; t++) {
      const off = d * t;
      for (let i = 0; i < data.length; i++) {
        const oi = off + i;
        if (oi >= out.length) break;
        out[oi] += data[i] * g * mix;
      }
      g *= feedback;
    }
    let pk = 0;
    for (let i = 0; i < out.length; i++) {
      const a = out[i] < 0 ? -out[i] : out[i];
      if (a > pk) pk = a;
    }
    if (pk > 0.95) {
      const k = 0.95 / pk;
      for (let i = 0; i < out.length; i++) out[i] *= k;
    }
    return out;
  }
  function voiceFingerprint(d, sr) {
    const T = 16, B = 8;
    const fp = new Float32Array(T * B);
    const frameLen = Math.floor(d.length / T);
    if (frameLen < 32) return fp;
    const edges = [];
    for (let b = 0; b <= B; b++) edges.push(150 * Math.pow(4e3 / 150, b / B));
    let N = 1;
    while (N * 2 <= Math.min(1024, frameLen)) N *= 2;
    const fft = new import_fft2.default(N);
    const inp = new Float64Array(N);
    const out = fft.createComplexArray();
    for (let t = 0; t < T; t++) {
      const off = t * frameLen;
      for (let i = 0; i < N; i++) {
        const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1));
        inp[i] = (off + i < d.length ? d[off + i] : 0) * w;
      }
      fft.realTransform(out, inp);
      for (let b = 0; b < B; b++) {
        const k0 = Math.max(1, Math.floor(edges[b] * N / sr));
        const k1 = Math.min(N / 2, Math.floor(edges[b + 1] * N / sr));
        let e = 0;
        for (let k = k0; k <= k1; k++) {
          const re = out[2 * k], im = out[2 * k + 1];
          e += Math.sqrt(re * re + im * im);
        }
        fp[t * B + b] = Math.log(1 + e);
      }
    }
    let mean = 0;
    for (let i = 0; i < fp.length; i++) mean += fp[i];
    mean /= fp.length;
    let nrm = 0;
    for (let i = 0; i < fp.length; i++) {
      fp[i] -= mean;
      nrm += fp[i] * fp[i];
    }
    nrm = Math.sqrt(nrm) || 1;
    for (let i = 0; i < fp.length; i++) fp[i] /= nrm;
    return fp;
  }
  function findRepeatedPhrase(voices, sr, thr = 0.85) {
    if (voices.length < 2) return { hook: null, count: voices.length };
    const fps = voices.map((v) => voiceFingerprint(v.data, sr));
    let bestCount = 0;
    let bestMember = null;
    for (let i = 0; i < voices.length; i++) {
      let count = 1;
      let rep = voices[i];
      for (let j = 0; j < voices.length; j++) {
        if (i === j) continue;
        let sim = 0;
        for (let k = 0; k < fps[i].length; k++) sim += fps[i][k] * fps[j][k];
        if (sim >= thr) {
          count++;
          if (voices[j].data.length > rep.data.length) rep = voices[j];
        }
      }
      if (count > bestCount) {
        bestCount = count;
        bestMember = rep;
      }
    }
    return bestCount >= 2 ? { hook: bestMember, count: bestCount } : { hook: null, count: 1 };
  }
  var MASTER = {
    "Hip-hop": { hpf: 72, bassHz: 200, bassDb: 1.5, presHz: 2500, presDb: 3, airHz: 8500, airDb: 1.5 },
    // bassi avanti, voce rap nei medi
    RnB: { hpf: 75, bassHz: 200, bassDb: 0.5, presHz: 3e3, presDb: 3.5, airHz: 9500, airDb: 2.5 },
    // caldo, voce morbida
    "Lo-fi": { hpf: 85, bassHz: 220, bassDb: -1, presHz: 2800, presDb: -1, airHz: 7500, airDb: -4 },
    // ovattato di proposito, alti smorzati
    Pop: { hpf: 95, bassHz: 220, bassDb: -4, presHz: 3500, presDb: 5, airHz: 1e4, airDb: 4 },
    // voce presente + brillante
    House: { hpf: 82, bassHz: 200, bassDb: -2, presHz: 3e3, presDb: 3, airHz: 1e4, airDb: 4.5 },
    Tekno: { hpf: 82, bassHz: 200, bassDb: -1.5, presHz: 3e3, presDb: 2.5, airHz: 11e3, airDb: 5 },
    EDM: { hpf: 85, bassHz: 220, bassDb: -3, presHz: 3500, presDb: 4, airHz: 11e3, airDb: 5.5 },
    Trance: { hpf: 88, bassHz: 220, bassDb: -3, presHz: 3500, presDb: 4, airHz: 12e3, airDb: 5.5 },
    Dubstep: { hpf: 62, bassHz: 180, bassDb: 2, presHz: 3e3, presDb: 3, airHz: 9500, airDb: 3.5 },
    // sub pesante
    DnB: { hpf: 72, bassHz: 200, bassDb: -0.5, presHz: 3e3, presDb: 3, airHz: 11e3, airDb: 5 },
    Reggae: { hpf: 55, bassHz: 180, bassDb: 3, presHz: 2500, presDb: 0, airHz: 8e3, airDb: -4 },
    // caldo, scuro, bassi enormi (dub)
    Rock: { hpf: 85, bassHz: 200, bassDb: -1, presHz: 2500, presDb: 5, airHz: 1e4, airDb: 2 },
    // medi avanti (chitarre)
    Jazz: { hpf: 70, bassHz: 180, bassDb: 1, presHz: 3e3, presDb: 1, airHz: 9e3, airDb: 1 }
    // naturale, caldo, gentile
  };
  var MASTER_DEFAULT = { hpf: 92, bassHz: 220, bassDb: -3, presHz: 3e3, presDb: 3, airHz: 9e3, airDb: 4 };
  var STEREO = {
    "Hip-hop": { monoBelowHz: 120, width: 0.95, lufs: -9, tpDb: -1.5 },
    // 808 rigorosamente mono, immagine stretta
    RnB: { monoBelowHz: 110, width: 1.05, lufs: -10, tpDb: -1 },
    "Lo-fi": { monoBelowHz: 100, width: 1, lufs: -14, tpDb: -1 },
    // volutamente non "loud"
    // Pop AGGIORNATO al suono moderno (misurato su "Girl, so confusing" di Charli XCX,
    // 2024): immagine più LARGA (corr. L/R 0.75 contro 0.84 del pop 2001) ma con i BASSI
    // ancora più stretti al centro (solo 8% di energia laterale sotto i 100 Hz).
    Pop: { monoBelowHz: 125, width: 1.45, lufs: -9, tpDb: -1.5 },
    House: { monoBelowHz: 110, width: 1.2, lufs: -9.5, tpDb: -1 },
    // largo sopra il basso, stretto sotto
    Tekno: { monoBelowHz: 110, width: 1.1, lufs: -9.5, tpDb: -1 },
    // centro molto compatto
    EDM: { monoBelowHz: 110, width: 1.4, lufs: -8, tpDb: -1.5 },
    Trance: { monoBelowHz: 110, width: 1.45, lufs: -8.5, tpDb: -1.5 },
    // il più ampio dei generi da club
    Dubstep: { monoBelowHz: 120, width: 1.3, lufs: -8, tpDb: -1.5 },
    // sub mono + lati estremi = massimo contrasto
    DnB: { monoBelowHz: 120, width: 1.2, lufs: -10, tpDb: -1 },
    Reggae: { monoBelowHz: 100, width: 0.95, lufs: -11, tpDb: -1 },
    // centrato, caldo
    Rock: { monoBelowHz: 105, width: 1.25, lufs: -10, tpDb: -1 },
    // chitarre larghe su spina dorsale mono
    Jazz: { monoBelowHz: 90, width: 1.05, lufs: -15, tpDb: -1 }
    // dinamica naturale, poco compresso
  };
  var STEREO_DEFAULT = { monoBelowHz: 110, width: 1.1, lufs: -10, tpDb: -1 };
  var PAN_BY_ROLE = {
    kick: 0,
    bass: 0,
    voice: 0,
    snare: 0,
    hat: 0.35,
    pad: -0.25,
    melody: -0.2,
    sparkle: 0.5,
    skank: -0.45,
    other: 0.15
  };
  function masterEq(pcm, sr, genre2) {
    const p = genre2 && MASTER[genre2] || MASTER_DEFAULT;
    hpfInplace(pcm, sr, p.hpf);
    shelfInplace(pcm, sr, p.bassHz, p.bassDb, false);
    peakInplace(pcm, sr, p.presHz, p.presDb, 1);
    shelfInplace(pcm, sr, p.airHz, p.airDb, true);
  }
  function masterReverb(pcm, sr, wet, spread = 0) {
    const n = pcm.length;
    if (!n || wet <= 0) return;
    const scale2 = sr / 44100;
    const combTuning = [1557, 1617, 1491, 1422, 1277, 1356].map((v) => v + spread);
    const apTuning = [225, 556, 441, 341].map((v) => v + spread);
    const feedback = 0.84;
    const damp = 0.2;
    const send = new Float32Array(n);
    const rc = 1 / (2 * Math.PI * 250), dt = 1 / sr, a = rc / (rc + dt);
    let px = pcm[0], py = pcm[0];
    for (let i = 1; i < n; i++) {
      const x = pcm[i];
      const y = a * (py + x - px);
      send[i] = y;
      px = x;
      py = y;
    }
    const nComb = combTuning.length;
    const nAp = apTuning.length;
    const cLen = new Int32Array(nComb);
    const cOff = new Int32Array(nComb);
    const aLen = new Int32Array(nAp);
    const aOff = new Int32Array(nAp);
    let total = 0;
    for (let c = 0; c < nComb; c++) {
      cLen[c] = Math.max(1, Math.round(combTuning[c] * scale2));
      cOff[c] = total;
      total += cLen[c];
    }
    for (let a2 = 0; a2 < nAp; a2++) {
      aLen[a2] = Math.max(1, Math.round(apTuning[a2] * scale2));
      aOff[a2] = total;
      total += aLen[a2];
    }
    const mem = new Float32Array(total);
    const cIdx = new Int32Array(nComb);
    const aIdx = new Int32Array(nAp);
    const cFilt = new Float32Array(nComb);
    const norm = 1 / nComb;
    const oneMinusDamp = 1 - damp;
    for (let i = 0; i < n; i++) {
      const x = send[i];
      let acc = 0;
      for (let c = 0; c < nComb; c++) {
        const p = cOff[c] + cIdx[c];
        const y = mem[p];
        const filt = y * oneMinusDamp + cFilt[c] * damp;
        cFilt[c] = filt;
        mem[p] = x + filt * feedback;
        const ni = cIdx[c] + 1;
        cIdx[c] = ni >= cLen[c] ? 0 : ni;
        acc += y;
      }
      let v = acc * norm;
      for (let a2 = 0; a2 < nAp; a2++) {
        const p = aOff[a2] + aIdx[a2];
        const bufout = mem[p];
        mem[p] = v + bufout * 0.5;
        v = bufout - v;
        const ni = aIdx[a2] + 1;
        aIdx[a2] = ni >= aLen[a2] ? 0 : ni;
      }
      pcm[i] += v * wet;
    }
  }
  function monoBelowAndWidth(L, R, sr, fc, width) {
    const n = Math.min(L.length, R.length);
    if (!n) return;
    const side = new Float32Array(n);
    for (let i = 0; i < n; i++) side[i] = (L[i] - R[i]) * 0.5;
    hpfInplace(side, sr, fc);
    hpfInplace(side, sr, fc);
    for (let i = 0; i < n; i++) {
      const mid = (L[i] + R[i]) * 0.5;
      const s = side[i] * width;
      L[i] = mid + s;
      R[i] = mid - s;
    }
  }
  var COMP_THR = 0.25;
  var COMP_MAX = 8;
  var COMP_N = 2048;
  var COMP_LUT = (() => {
    const t = new Float32Array(COMP_N + 1);
    for (let i = 0; i <= COMP_N; i++) {
      const env = COMP_THR + (COMP_MAX - COMP_THR) * i / COMP_N;
      t[i] = Math.pow(env / COMP_THR, 1 / 3 - 1);
    }
    return t;
  })();
  function compGain(env) {
    if (env <= COMP_THR) return 1;
    if (env >= COMP_MAX) return Math.pow(env / COMP_THR, 1 / 3 - 1);
    const p = (env - COMP_THR) / (COMP_MAX - COMP_THR) * COMP_N;
    const i = p | 0;
    const f = p - i;
    return COMP_LUT[i] * (1 - f) + COMP_LUT[i + 1] * f;
  }
  function measureLufs(L, R, srIn) {
    const n0 = Math.min(L.length, R.length);
    if (!n0) return -70;
    const D = srIn >= 44e3 ? 2 : 1;
    const sr = srIn / D;
    const n = Math.floor(n0 / D);
    const k = (x) => {
      const y = new Float32Array(n);
      if (D === 1) y.set(x.subarray(0, n));
      else for (let i = 0; i < n; i++) y[i] = (x[2 * i] + x[2 * i + 1]) * 0.5;
      shelfInplace(y, sr, 1500, 4, true, 0.707);
      hpfInplace(y, sr, 38, 0.5);
      return y;
    };
    const kl = k(L);
    const kr = k(R);
    const win = Math.max(1, Math.floor(sr * 0.4));
    const step = Math.max(1, Math.floor(win / 4));
    const blocks = [];
    for (let s = 0; s + win <= n; s += step) {
      let e = 0;
      for (let i = s; i < s + win; i++) e += kl[i] * kl[i] + kr[i] * kr[i];
      const ms = e / win;
      blocks.push(ms > 0 ? -0.691 + 10 * Math.log10(ms) : -70);
    }
    if (!blocks.length) return -70;
    const abs = blocks.filter((b) => b > -70);
    if (!abs.length) return -70;
    const meanAbs = abs.reduce((a, b) => a + Math.pow(10, b / 10), 0) / abs.length;
    const relGate = 10 * Math.log10(meanAbs) - 10;
    const kept = abs.filter((b) => b > relGate);
    const use = kept.length ? kept : abs;
    const mean = use.reduce((a, b) => a + Math.pow(10, b / 10), 0) / use.length;
    return 10 * Math.log10(mean);
  }
  function limiterStereo(L, R, sr, ceiling = 0.891, laMs = 5, relMs = 120) {
    const n = Math.min(L.length, R.length);
    if (!n) return;
    const LA = Math.max(1, Math.round(laMs * sr / 1e3));
    const rel = Math.exp(-1 / (relMs / 1e3 * sr));
    const g = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = Math.max(Math.abs(L[i]), Math.abs(R[i]));
      g[i] = a > ceiling ? ceiling / a : 1;
    }
    const inc = 1 / LA;
    for (let i = n - 2; i >= 0; i--) if (g[i] > g[i + 1] + inc) g[i] = g[i + 1] + inc;
    let cur = g[0];
    for (let i = 0; i < n; i++) {
      const t = g[i];
      cur = t < cur ? t : rel * cur + (1 - rel) * t;
      L[i] *= cur;
      R[i] *= cur;
    }
  }
  function masterStereo(L, R, sr, genre2) {
    var _a;
    const n = Math.min(L.length, R.length);
    if (!n) return;
    const st = genre2 && STEREO[genre2] || STEREO_DEFAULT;
    let peak = 0;
    for (let i = 0; i < n; i++) {
      const a = Math.max(Math.abs(L[i]), Math.abs(R[i]));
      if (a > peak) peak = a;
    }
    if (peak > 1e-6) {
      const g = 0.9 / peak;
      for (let i = 0; i < n; i++) {
        L[i] *= g;
        R[i] *= g;
      }
    }
    masterEq(L, sr, genre2);
    masterEq(R, sr, genre2);
    const rvb = genre2 && ((_a = GENRES[genre2]) == null ? void 0 : _a.reverb) || 0;
    if (rvb > 0) {
      masterReverb(L, sr, rvb, 0);
      masterReverb(R, sr, rvb, 23);
    }
    const msC = Math.exp(-1 / (0.01 * sr));
    const aC = Math.exp(-1 / (0.03 * sr));
    const rC = Math.exp(-1 / (0.25 * sr));
    let ms = 0;
    let env = 0;
    for (let i = 0; i < n; i++) {
      const x = (L[i] + R[i]) * 0.5;
      ms = msC * ms + (1 - msC) * x * x;
      const det = Math.sqrt(ms);
      env = det > env ? aC * env + (1 - aC) * det : rC * env + (1 - rC) * det;
      if (env > COMP_THR) {
        const gg = compGain(env);
        L[i] *= gg;
        R[i] *= gg;
      }
    }
    monoBelowAndWidth(L, R, sr, st.monoBelowHz, st.width);
    const ceiling = Math.pow(10, st.tpDb / 20);
    let limited = false;
    for (let pass = 0; pass < 2; pass++) {
      const lufs = measureLufs(L, R, sr);
      if (lufs <= -70) break;
      let gain = Math.pow(10, (st.lufs - lufs) / 20);
      gain = Math.max(0.25, Math.min(gain, pass === 0 ? 12 : 3));
      if (Math.abs(20 * Math.log10(gain)) < 0.3) break;
      for (let i = 0; i < n; i++) {
        L[i] *= gain;
        R[i] *= gain;
      }
      limiterStereo(L, R, sr, ceiling, 5, 120);
      limited = true;
    }
    if (!limited) limiterStereo(L, R, sr, ceiling, 5, 120);
  }
  function mixInto(out, data, startSample, rate, gain, maxOut, sr, loop = false, outR, pan = 0) {
    const outLen = out.length;
    const srcLen = data.length;
    const p = Math.max(-1, Math.min(1, pan));
    const ang = (p + 1) * Math.PI / 4;
    const gL = outR ? Math.cos(ang) * Math.SQRT2 : 1;
    const gR = outR ? Math.sin(ang) * Math.SQRT2 : 1;
    const onePass = Math.max(0, Math.floor((srcLen - 1) / rate));
    if (onePass <= 0) return;
    const longGrain = onePass > sr * 0.2;
    const edge = onePass > 8 ? Math.min(Math.floor(sr * (longGrain ? 0.02 : 5e-3)), Math.floor(onePass / 2)) : 0;
    if (!loop || maxOut <= onePass) {
      const usable = Math.min(maxOut, Math.min(onePass, outLen - startSample));
      if (usable <= 0) return;
      const fadeN = usable > 8 ? Math.min(edge, Math.floor(usable / 2)) : 0;
      let srcPos = 0;
      let si = 0;
      const invFade = fadeN > 0 ? 1 / fadeN : 0;
      const gainL = gain * gL;
      const gainR = gain * gR;
      for (let j = 0; j < usable; j++) {
        const frac = srcPos - si;
        let env = 1;
        if (fadeN > 0) {
          if (j < fadeN) env = j * invFade;
          else if (j > usable - fadeN) env = (usable - j) * invFade;
        }
        const s = (data[si] * (1 - frac) + data[si + 1] * frac) * env;
        const oi = startSample + j;
        out[oi] += s * gainL;
        if (outR) outR[oi] += s * gainR;
        srcPos += rate;
        while (srcPos - si >= 1) si++;
      }
      return;
    }
    const shortGrain = onePass < sr * 0.25;
    const xf = shortGrain ? Math.max(1, Math.floor(onePass / 2)) : Math.max(1, Math.min(Math.floor(onePass / 3), Math.floor(sr * 0.03)));
    const period = Math.max(1, onePass - xf);
    const total = Math.min(maxOut, outLen - startSample);
    const gFade = Math.min(edge, Math.floor(total / 2));
    for (let j = 0; j < total; j++) {
      const oi = startSample + j;
      if (oi >= outLen) break;
      let gEnv = 1;
      if (gFade > 0) {
        if (j < gFade) gEnv = j / gFade;
        else if (j > total - gFade) gEnv = (total - j) / gFade;
      }
      const rep = Math.floor(j / period);
      const local = j - rep * period;
      let sum = 0;
      {
        const srcPos = local * rate;
        const si = Math.floor(srcPos);
        if (si + 1 < srcLen) {
          const frac = srcPos - si;
          const w = local < xf && rep > 0 ? local / xf : 1;
          sum += (data[si] * (1 - frac) + data[si + 1] * frac) * w;
        }
      }
      if (local < xf && rep > 0) {
        const srcPos = (local + period) * rate;
        const si = Math.floor(srcPos);
        if (si + 1 < srcLen) {
          const frac = srcPos - si;
          const w = 1 - local / xf;
          sum += (data[si] * (1 - frac) + data[si + 1] * frac) * w;
        }
      }
      const v = sum * gain * gEnv;
      out[oi] += v * gL;
      if (outR) outR[oi] += v * gR;
    }
  }

  // web/main.ts
  var GENRES2 = ["Pop", "Hip-hop", "RnB", "Lo-fi", "House", "Tekno", "EDM", "Trance", "Dubstep", "DnB", "Reggae", "Rock", "Jazz"];
  var SCALES2 = ["Major", "Minor", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Locrian", "Harmonic Minor", "Pentatonic", "Chromatic"];
  var DEF = {
    House: { bpm: 125, scale: "Minor" },
    Tekno: { bpm: 180, scale: "Dorian" },
    EDM: { bpm: 128, scale: "Minor" },
    Trance: { bpm: 138, scale: "Minor" },
    Dubstep: { bpm: 140, scale: "Harmonic Minor" },
    DnB: { bpm: 174, scale: "Minor" },
    "Hip-hop": { bpm: 90, scale: "Minor" },
    RnB: { bpm: 85, scale: "Minor" },
    "Lo-fi": { bpm: 82, scale: "Dorian" },
    Pop: { bpm: 112, scale: "Major" },
    Reggae: { bpm: 78, scale: "Major" },
    Rock: { bpm: 120, scale: "Minor" },
    Jazz: { bpm: 120, scale: "Dorian" }
  };
  var genre = "Pop";
  var scale = "Major";
  var bpm = 112;
  var meter = "4/4";
  var recPCM = null;
  var recSR = 48e3;
  var outPCM = null;
  var outPCMR = null;
  var outSR = 48e3;
  var ctx = null;
  var recStream = null;
  var recNode = null;
  var recSource = null;
  var recBuffers = [];
  var recording = false;
  var recStart = 0;
  var recTimer;
  var playSrc = null;
  var segCache = null;
  var $ = (id) => document.getElementById(id);
  var setStatus = (t) => $("status").textContent = t;
  var MAX_REC_SEC = 6 * 60;
  var mmss = (sec) => {
    const t = Math.max(0, Math.floor(sec));
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  };
  var WAVE_BARS = 56;
  var waveLevels = [];
  var levelFromPeak = (peak) => Math.min(1, Math.pow(Math.min(1, peak), 0.45));
  function pushLevel(peak) {
    waveLevels.push({ h: levelFromPeak(peak), hot: peak > 0.92 });
    if (waveLevels.length > WAVE_BARS) waveLevels.shift();
  }
  function renderWave() {
    var _a;
    const host = $("wave");
    if (!waveLevels.length) {
      host.innerHTML = '<span class="waveHint">Your waveform will appear here</span>';
      return;
    }
    if (host.childElementCount !== waveLevels.length || !((_a = host.firstElementChild) == null ? void 0 : _a.classList.contains("bar"))) {
      host.innerHTML = "";
      for (let i = 0; i < waveLevels.length; i++) {
        const d = document.createElement("div");
        d.className = "bar";
        host.appendChild(d);
      }
    }
    for (let i = 0; i < waveLevels.length; i++) {
      const el = host.children[i];
      const b = waveLevels[i];
      el.style.height = (4 + b.h * 76).toFixed(0) + "px";
      el.className = b.hot ? "bar hot" : "bar";
    }
  }
  function buildChips(host, items, get, set) {
    host.innerHTML = "";
    for (const it of items) {
      const el = document.createElement("div");
      el.className = "chip" + (get() === it ? " on" : "");
      el.textContent = it;
      el.onclick = () => {
        set(it);
        refreshChips();
      };
      host.appendChild(el);
    }
  }
  function refreshChips() {
    buildChips($("genres"), GENRES2, () => genre, (v) => {
      genre = v;
      scale = DEF[v].scale;
      bpm = DEF[v].bpm;
      $("bpm").value = String(bpm);
      $("bpmVal").textContent = String(bpm);
      onParamsChanged();
    });
    buildChips($("scales"), SCALES2, () => scale, (v) => {
      scale = v;
      onParamsChanged();
    });
  }
  refreshChips();
  $("bpm").oninput = (e) => {
    bpm = +e.target.value;
    $("bpmVal").textContent = String(bpm);
    onParamsChanged();
  };
  $("surpriseBtn").onclick = () => {
    genre = GENRES2[Math.floor(Math.random() * GENRES2.length)];
    scale = SCALES2[Math.floor(Math.random() * SCALES2.length)];
    const base = DEF[genre].bpm;
    bpm = Math.max(50, Math.min(180, Math.round(base + (Math.random() * 16 - 8))));
    $("bpm").value = String(bpm);
    $("bpmVal").textContent = String(bpm);
    refreshChips();
    onParamsChanged();
    setStatus(`\u{1F3B2} ${genre} \xB7 ${scale} \xB7 ${bpm} BPM \u2014 press Generate!`);
  };
  async function startRec() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus("This browser does not support microphone access. Try Chrome or Safari (latest).");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 2 } });
      recStream = stream;
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") await ctx.resume();
      recSR = ctx.sampleRate;
      recBuffers = [];
      recSource = ctx.createMediaStreamSource(stream);
      const inCh = Math.min(2, recSource.channelCount || 1);
      recNode = ctx.createScriptProcessor(4096, inCh, inCh);
      const mute = ctx.createGain();
      mute.gain.value = 0;
      recNode.onaudioprocess = (e) => {
        const ib = e.inputBuffer;
        const c0 = ib.getChannelData(0);
        let block;
        if (ib.numberOfChannels > 1) {
          const c1 = ib.getChannelData(1);
          const m = new Float32Array(c0.length);
          for (let i = 0; i < c0.length; i++) m[i] = (c0[i] + c1[i]) * 0.5;
          block = m;
        } else {
          block = Float32Array.from(c0);
        }
        recBuffers.push(block);
        let pk = 0;
        for (let i = 0; i < block.length; i += 4) {
          const a = block[i] < 0 ? -block[i] : block[i];
          if (a > pk) pk = a;
        }
        pushLevel(pk);
      };
      recSource.connect(recNode);
      recNode.connect(mute);
      mute.connect(ctx.destination);
      recording = true;
      recStart = performance.now();
      $("recBtn").classList.add("on");
      $("recBtn").textContent = "\u25A0 Stop";
      waveLevels = [];
      const tick = () => {
        const el = (performance.now() - recStart) / 1e3;
        $("recTime").innerHTML = `<span class="recdot">\u25CF</span> REC <b class="rectime">${mmss(el)}</b> <span class="recmax">/ ${mmss(MAX_REC_SEC)}</span>`;
        renderWave();
        if (el >= MAX_REC_SEC) stopRec();
      };
      tick();
      recTimer = window.setInterval(tick, 100);
    } catch (e) {
      const name = (e == null ? void 0 : e.name) || (e == null ? void 0 : e.message) || e;
      setStatus("Microphone unavailable: " + name + ". Allow the mic; on iPhone use Safari directly (not an in-app browser).");
    }
  }
  function stopRec() {
    if (!recording) return;
    recording = false;
    clearInterval(recTimer);
    try {
      recSource && recSource.disconnect();
    } catch {
    }
    try {
      recNode && recNode.disconnect();
    } catch {
    }
    if (recStream) recStream.getTracks().forEach((t) => t.stop());
    $("recBtn").classList.remove("on");
    $("recBtn").textContent = "\u25CF Record";
    let len = 0;
    for (const b of recBuffers) len += b.length;
    if (len < recSR * 0.2) {
      setStatus("Recording too short \u2014 hold Record a bit longer.");
      return;
    }
    recPCM = new Float32Array(len);
    let off = 0;
    for (const b of recBuffers) {
      recPCM.set(b, off);
      off += b.length;
    }
    recBuffers = [];
    stopPlay();
    setGenBtn("generate");
    const recSec = recPCM.length / recSR;
    $("recTime").innerHTML = `\u2713 Recorded <b class="rectime">${mmss(recSec)}</b>`;
    waveLevels = [];
    const step = Math.max(1, Math.floor(recPCM.length / WAVE_BARS));
    for (let s = 0; s + step <= recPCM.length; s += step) {
      let pk = 0;
      for (let i = s; i < s + step; i += 8) {
        const a = recPCM[i] < 0 ? -recPCM[i] : recPCM[i];
        if (a > pk) pk = a;
      }
      pushLevel(pk);
    }
    renderWave();
    setStatus(`Recorded ${mmss(recSec)}. Pick a genre and press Generate.`);
  }
  $("recBtn").onclick = () => {
    if (recording) stopRec();
    else startRec();
  };
  var breathe = () => new Promise((r) => setTimeout(r, 0));
  async function generate() {
    var _a, _b;
    if (!recPCM) return;
    const gb = $("genBtn");
    gb.disabled = true;
    const step = (t) => {
      gb.textContent = "\u2026 " + t;
      setStatus(t);
    };
    step("Starting\u2026");
    await breathe();
    try {
      if (!segCache || segCache.pcm !== recPCM) {
        step("Analyzing sounds\u2026");
        await breathe();
        const mono = Float32Array.from(recPCM);
        highpass(mono, recSR);
        normalize(mono, 0.98);
        const stats2 = { onsets: 0, noise: 0, kept: 0, noiseFrac: 0, floorRatio: 0, noisy: false };
        segCache = { pcm: recPCM, segs: extractAndClassify(mono, recSR, stats2), noisy: stats2.noisy };
      }
      const segs = segCache.segs;
      const stats = { noisy: segCache.noisy };
      if (!segs.length) {
        setStatus("No usable sound found.");
        setGenBtn("generate");
        return;
      }
      step("Composing\u2026");
      await breathe();
      const opts = { bpm, scale, genre, meter };
      const { events, durationSec } = buildEvents(segs, opts, 60, recSR);
      step("Mixing\u2026");
      await breathe();
      const n = Math.ceil((durationSec + 2) * recSR);
      const outL = new Float32Array(n);
      const outR = new Float32Array(n);
      const CHUNK = 250;
      for (let i = 0; i < events.length; i += CHUNK) {
        const end = Math.min(events.length, i + CHUNK);
        for (let k = i; k < end; k++) {
          const ev = events[k];
          mixInto(outL, ev.seg.data, Math.floor(ev.when * recSR), ev.rate, ev.gain, Math.floor(ev.dur * recSR), recSR, ev.sustain, outR, (_a = ev.pan) != null ? _a : 0);
        }
        step(`Mixing\u2026 ${Math.round(end / events.length * 100)}%`);
        await breathe();
      }
      step("Mastering\u2026");
      await breathe();
      masterStereo(outL, outR, recSR, genre);
      outPCM = outL;
      outPCMR = outR;
      outSR = recSR;
      $("expBtn").disabled = false;
      play();
      const warn = stats.noisy ? " \u26A0\uFE0F Lots of background noise \u2014 for best quality, record in a quieter spot." : "";
      setStatus(`Done! ${durationSec.toFixed(0)}s of ${genre}. Press Stop/Play, or Export.${warn}`);
    } catch (e) {
      setStatus("Error: " + ((_b = e == null ? void 0 : e.message) != null ? _b : e));
      setGenBtn("generate");
    }
  }
  var genState = "generate";
  var playToken = 0;
  function setGenBtn(state) {
    genState = state;
    const b = $("genBtn");
    b.disabled = false;
    b.textContent = state === "generate" ? "\u266A Generate music" : state === "stop" ? "\u25A0 Stop" : "\u25B6 Play";
    b.classList.toggle("rec", state === "stop");
    b.classList.toggle("gen", state !== "stop");
  }
  $("genBtn").onclick = () => {
    if (genState === "generate") generate();
    else if (genState === "stop") {
      stopPlay();
      setGenBtn("play");
    } else play();
  };
  function play() {
    if (!outPCM || !ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    try {
      playSrc == null ? void 0 : playSrc.stop();
    } catch {
    }
    const token = ++playToken;
    const buf = ctx.createBuffer(outPCMR ? 2 : 1, outPCM.length, outSR);
    buf.getChannelData(0).set(outPCM);
    if (outPCMR) buf.getChannelData(1).set(outPCMR);
    playSrc = ctx.createBufferSource();
    playSrc.buffer = buf;
    playSrc.connect(ctx.destination);
    playSrc.onended = () => {
      if (token === playToken && genState === "stop") setGenBtn("play");
    };
    playSrc.start();
    setGenBtn("stop");
  }
  function stopPlay() {
    playToken++;
    try {
      playSrc == null ? void 0 : playSrc.stop();
    } catch {
    }
    playSrc = null;
  }
  function onParamsChanged() {
    if (outPCM) {
      stopPlay();
      setGenBtn("generate");
      $("expBtn").disabled = true;
    }
  }
  function pcmToWav(pcm, sr, R) {
    const ch = R ? 2 : 1;
    const frames = R ? Math.min(pcm.length, R.length) : pcm.length;
    const n = frames * ch, dataSize = n * 2, blockAlign = 2 * ch;
    const buf = new ArrayBuffer(44 + dataSize), v = new DataView(buf);
    const w = (o2, s) => {
      for (let i = 0; i < s.length; i++) v.setUint8(o2 + i, s.charCodeAt(i));
    };
    w(0, "RIFF");
    v.setUint32(4, 36 + dataSize, true);
    w(8, "WAVE");
    w(12, "fmt ");
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, ch, true);
    v.setUint32(24, sr, true);
    v.setUint32(28, sr * blockAlign, true);
    v.setUint16(32, blockAlign, true);
    v.setUint16(34, 16, true);
    w(36, "data");
    v.setUint32(40, dataSize, true);
    let o = 44;
    const put = (x) => {
      const s = Math.max(-1, Math.min(1, x));
      v.setInt16(o, s < 0 ? s * 32768 : s * 32767, true);
      o += 2;
    };
    for (let i = 0; i < frames; i++) {
      put(pcm[i]);
      if (R) put(R[i]);
    }
    return new Uint8Array(buf);
  }
  $("expBtn").onclick = () => {
    if (!outPCM) return;
    const blob = new Blob([pcmToWav(outPCM, outSR, outPCMR != null ? outPCMR : void 0).buffer], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const cl = (s) => s.replace(/[^A-Za-z0-9]/g, "");
    const d = /* @__PURE__ */ new Date();
    const stamp = String(d.getDate()).padStart(2, "0") + String(d.getMonth() + 1).padStart(2, "0") + d.getFullYear();
    const name = `MCParrot_${cl(genre)}_${Math.round(bpm)}bpm${cl(scale)}${stamp}.wav`;
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5e3);
  };
})();
