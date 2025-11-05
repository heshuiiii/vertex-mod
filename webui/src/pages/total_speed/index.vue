<!-- webui/src/pages/Dashboard.vue 或相关页面 -->

<template>
  <div class="total-speed-container">
    <el-card class="speed-card">
      <div class="speed-header">
        <h3>所有下载器总速度</h3>
        <el-button 
          size="small" 
          icon="el-icon-refresh" 
          @click="refreshSpeed"
          :loading="loading"
        >
          刷新
        </el-button>
      </div>
      
      <div class="speed-display">
        <div class="speed-item download">
          <i class="el-icon-download"></i>
          <div class="speed-info">
            <span class="speed-label">总下载速度</span>
            <span class="speed-value">{{ downloadSpeedFormatted }}</span>
          </div>
        </div>
        
        <div class="speed-item upload">
          <i class="el-icon-upload2"></i>
          <div class="speed-info">
            <span class="speed-label">总上传速度</span>
            <span class="speed-value">{{ uploadSpeedFormatted }}</span>
          </div>
        </div>
      </div>
      
      <!-- 可选：显示各个下载器的详细速度 -->
      <el-collapse v-if="showDetails" class="downloader-details">
        <el-collapse-item 
          v-for="downloader in downloaderStats" 
          :key="downloader.id"
          :title="downloader.name"
        >
          <div class="detail-speeds">
            <span>下载: {{ formatSpeed(downloader.downloadSpeed) }}</span>
            <span>上传: {{ formatSpeed(downloader.uploadSpeed) }}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import { getTotalSpeed, getAllDownloaderStats } from '@/api/downloader';

export default {
  name: 'TotalSpeedMonitor',
  data() {
    return {
      downloadSpeedFormatted: '0 B/s',
      uploadSpeedFormatted: '0 B/s',
      downloaderStats: [],
      loading: false,
      showDetails: false,
      timer: null
    };
  },
  mounted() {
    this.refreshSpeed();
    // 每4秒自动刷新一次（与Vertex默认周期一致）
    this.timer = setInterval(this.refreshSpeed, 4000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async refreshSpeed() {
      this.loading = true;
      try {
        const response = await getTotalSpeed();
        if (response.success) {
          this.downloadSpeedFormatted = response.data.downloadSpeedFormatted;
          this.uploadSpeedFormatted = response.data.uploadSpeedFormatted;
        }
        
        // 如果需要显示详情
        if (this.showDetails) {
          const detailResponse = await getAllDownloaderStats();
          if (detailResponse.success) {
            this.downloaderStats = detailResponse.data;
          }
        }
      } catch (error) {
        console.error('获取速度失败:', error);
        this.$message.error('获取下载器速度失败');
      } finally {
        this.loading = false;
      }
    },
    
    formatSpeed(bytesPerSecond) {
      const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
      let speed = bytesPerSecond;
      let unitIndex = 0;
      
      while (speed >= 1024 && unitIndex < units.length - 1) {
        speed /= 1024;
        unitIndex++;
      }
      
      return `${speed.toFixed(2)} ${units[unitIndex]}`;
    }
  }
};
</script>

<style scoped>
.total-speed-container {
  margin: 20px 0;
}

.speed-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.speed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.speed-display {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.speed-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  flex: 1;
}

.speed-item i {
  font-size: 48px;
}

.speed-info {
  display: flex;
  flex-direction: column;
}

.speed-label {
  font-size: 14px;
  opacity: 0.8;
}

.speed-value {
  font-size: 28px;
  font-weight: bold;
  margin-top: 5px;
}

.downloader-details {
  margin-top: 20px;
}

.detail-speeds {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
</style>
